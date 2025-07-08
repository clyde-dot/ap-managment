import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UsersService } from 'src/modules/users/users.service'
import { User } from '@prisma/client'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: configService.getOrThrow('NODE_ENV') === 'dev',
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN'),
    })
  }

  async validate({ id }: { id: string }): Promise<User> {
    const user = await this.usersService.findId(id)
    if (!user) {
      throw new UnauthorizedException()
    }
    return user
  }
}
