import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
