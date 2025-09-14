import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class SearchWordDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  languageId?: number

  @IsNotEmpty()
  @IsString()
  search: string
}
