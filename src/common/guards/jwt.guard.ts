import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  public constructor(private readonly reflector: Reflector) {
    super()
  }

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicDecoratorExist = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler())

    if (isPublicDecoratorExist) {
      return true
    }

    return super.canActivate(context)
  }
}
