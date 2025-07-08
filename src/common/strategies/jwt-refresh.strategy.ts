import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from 'src/modules/users/users.service'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req?.cookies?.refreshToken]),
      secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN'),
      ignoreExpiration: false,
    })
  }

  async validate({ id }: { id: string }) {
    const user = await this.usersService.findId(id)
    if (!user) {
      throw new UnauthorizedException('Invalid user')
    }
    return user
  }
}
