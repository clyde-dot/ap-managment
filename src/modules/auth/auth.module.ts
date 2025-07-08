import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from '../../common/strategies/local.strategy'
import { JwtRefreshStrategy } from '../../common/strategies/jwt-refresh.strategy'
import { JwtStrategy } from '../../common/strategies/jwt.strategy'

@Module({
  imports: [ConfigModule, UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
