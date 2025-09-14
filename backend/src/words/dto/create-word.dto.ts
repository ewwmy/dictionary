import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator'
import { Constants } from 'src/constants/constants'

export class CreateWordDto {
  @IsOptional()
  @IsInt()
  @Min(Constants.WORD.MIN_FORMALITY)
  @Max(Constants.WORD.MAX_FORMALITY)
  formality: number

  @IsOptional()
  @IsInt()
  @Min(Constants.WORD.MIN_COMPLEXITY)
  @Max(Constants.WORD.MAX_COMPLEXITY)
  complexity: number

  @IsNotEmpty()
  @IsString()
  word: string

  @IsOptional()
  @IsString()
  word2: string

  @IsOptional()
  @IsString()
  word3: string

  @IsOptional()
  @IsString()
  translation: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  transcriptionStrict: string

  @IsOptional()
  @IsString()
  transcriptionPhonetic: string

  @IsOptional()
  @IsBoolean()
  isFavorite: boolean
}
