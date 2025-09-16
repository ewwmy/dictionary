import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'
import { Messages } from 'src/messages/messages.const'

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: Messages.PAGINATION.PAGE_LESS_ERROR(1) })
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: Messages.PAGINATION.LIMIT_LESS_ERROR(1) })
  limit?: number
}
