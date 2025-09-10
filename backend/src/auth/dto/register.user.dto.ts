import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class RegisterUserDto {
  @IsString()
  @MinLength(3, {
    message: 'Name is too short',
  })
  @MaxLength(50, {
    message: 'Name is too long',
  })
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @MinLength(8, {
    message: 'Password is too short',
  })
  @MaxLength(128, {
    message: 'Password is too long',
  })
  password: string
}
