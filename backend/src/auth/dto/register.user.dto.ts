import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { Messages } from 'src/messages/messages.const'

export class RegisterUserDto {
  @IsString()
  @MinLength(3, {
    message: Messages.USER.NAME_TOO_SHORT,
  })
  @MaxLength(50, {
    message: Messages.USER.NAME_TOO_LONG,
  })
  @IsNotEmpty()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @MinLength(8, {
    message: Messages.USER.PASSWORD_TOO_SHORT,
  })
  @MaxLength(128, {
    message: Messages.USER.PASSWORD_TOO_LONG,
  })
  @IsNotEmpty()
  password: string
}
