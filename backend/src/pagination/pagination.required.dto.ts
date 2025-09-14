import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, Min } from 'class-validator'
import { Constants } from 'src/constants/constants'
import { Messages } from 'src/messages/messages.const'

export class PaginationRequiredDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: Messages.PAGINATION.PAGE_LESS_ERROR(1) })
  page: number = Constants.PAGINATION.DEFAULT_PAGE

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: Messages.PAGINATION.LIMIT_LESS_ERROR(1) })
  limit: number = Constants.PAGINATION.DEFAULT_LIMIT
}
