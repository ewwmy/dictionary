import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ImportOverwriteType } from './import.overwrite-types'
import { Constants } from 'src/constants/constants'

export class ImportDto {
  @IsString()
  @IsNotEmpty()
  data: string

  @IsEnum(ImportOverwriteType)
  @IsNotEmpty()
  overwrite: ImportOverwriteType

  @IsString()
  @IsOptional()
  mergeDelimiter: string = Constants.IMPORT.DEFAULT_MERGE_DELIMITER
}
