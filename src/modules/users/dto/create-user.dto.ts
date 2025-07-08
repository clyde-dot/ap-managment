import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  readonly fullName: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  readonly password: string
}
