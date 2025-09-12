import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { Constants } from 'src/constants/constants'
import { Messages } from 'src/messages/messages.const'

export class UpdateUserDto {
  @IsString()
  @MinLength(Constants.USERNAME_MIN_LENGTH, {
    message: Messages.USER.NAME_TOO_SHORT,
  })
  @MaxLength(Constants.USERNAME_MAX_LENGTH, {
    message: Messages.USER.NAME_TOO_LONG,
  })
  @IsOptional()
  name: string

  @IsString()
  @MinLength(Constants.PASSWORD_MIN_LENGTH, {
    message: Messages.USER.PASSWORD_TOO_SHORT,
  })
  @MaxLength(Constants.PASSWORD_MAX_LENGTH, {
    message: Messages.USER.PASSWORD_TOO_LONG,
  })
  @IsOptional()
  password: string
}
