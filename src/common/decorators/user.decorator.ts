import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUserDecorator = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest()
  return data ? user[data] : user
})
