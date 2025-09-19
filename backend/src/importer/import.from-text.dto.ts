import { IsNotEmpty, IsString } from 'class-validator'

export class ImportFromTextDto {
  @IsString()
  @IsNotEmpty()
  data: string
}
