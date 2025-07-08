import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { RegistrationDto } from './dto/registration.dto'
import type { $Enums, User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { compareSync } from 'bcrypt'

type Tokens = {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registration(registrationDto: RegistrationDto): Promise<Tokens> {
    const isAlreadyExits = await this.usersService.findEmail(registrationDto.email)
    if (isAlreadyExits) {
      throw new BadRequestException('Пользователь с таким email уже существует')
    }
    const user = await this.usersService.create(registrationDto)
    const tokens = await this.generateTokens(user)

    return tokens
  }

  async login(user: User): Promise<Tokens> {
    const tokens = await this.generateTokens(user)
    return tokens
  }

  async logout(id: string): Promise<void> {
    await this.usersService.updateRefreshToken(id, null)
  }

  async refresh(user: User): Promise<Tokens> {
    const tokens = await this.generateTokens(user)
    return tokens
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findEmail(email)
    if (!user) {
      throw new BadRequestException('Пользователь не найден')
    }
    const isValidPassword = compareSync(password, user.password)
    if (!isValidPassword) {
      throw new BadRequestException('Неправильный пароль')
    }
    return user
  }

  async generateTokens(user: User): Promise<Tokens> {
    const payload = {
      id: user.id,
      role: user.role,
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN'),
      expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRE'),
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN'),
      expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRE'),
    })
    await this.usersService.updateRefreshToken(user.id, refreshToken)
    return { accessToken, refreshToken }
  }
}
