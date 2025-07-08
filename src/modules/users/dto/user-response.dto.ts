import { Role, User } from '@prisma/client'
import { Exclude } from 'class-transformer'

export class UserResponseDto implements User {
  id: string
  fullName: string
  email: string
  createdAt: Date
  updatedAt: Date

  @Exclude()
  role: Role

  @Exclude()
  password: string

  @Exclude()
  token: string | null
}
