import { IsOptional, IsString, Length, MaxLength } from 'class-validator'
import { Messages } from 'src/messages/messages.const'

export class UpdateLanguageDto {
  @IsString()
  @MaxLength(150, {
    message: Messages.LANGUAGE.NAME_TOO_LONG,
  })
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  country: string

  @IsString()
  @Length(1)
  @IsOptional()
  flag: string
}
