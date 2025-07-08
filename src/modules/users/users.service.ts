import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { hashSync } from 'bcrypt'
import { PrismaService } from 'src/libs/prisma/prisma.service'
import { Prisma, type User } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = hashSync(createUserDto.password, 10)

    try {
      const createdUser = await this.prismaService.user.create({
        data: { ...createUserDto, password: hashedPassword },
      })

      return createdUser
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Пользователь с таким email уже существует')
        }
      }
      throw error
    }
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany()
  }

  async findId(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({ where: { id } })
    return user
  }

  async findEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({ where: { email } })
    return user
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.prismaService.user.update({
      where: { id },
      data: { token: refreshToken },
    })
  }

  getUsers(): Promise<User[]> {
    return this.prismaService.user.findMany()
  }
}
