import { Request } from 'express'
import { User } from '@prisma/client' // или свой тип пользователя

export interface RequestWithUser extends Request {
  user: User
}
