import { Controller, Get } from '@nestjs/common'
import { UsersService } from './users.service'
import { CurrentUserDecorator } from 'src/common/decorators/user.decorator'
import { Role, type User } from '@prisma/client'
import { UserResponseDto } from './dto/user-response.dto'
import { plainToInstance } from 'class-transformer'
import { Roles } from 'src/common/decorators/roles.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMyProfile(@CurrentUserDecorator() user: User): Promise<UserResponseDto> {
    return plainToInstance(UserResponseDto, user)
  }

  @Roles([Role.ADMIN, Role.OPERATOR, Role.PROGRAMMER])
  @Get()
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers()
  }
}
