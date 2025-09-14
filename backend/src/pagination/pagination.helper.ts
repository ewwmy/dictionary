import { Constants } from 'src/constants/constants'
import { PaginationOptionalDto } from './pagination.optional.dto'
import { PaginationRequiredDto } from './pagination.required.dto'
import { BadRequestException } from '@nestjs/common'
import { Messages } from 'src/messages/messages.const'

export const getPagination = <
  T extends PaginationOptionalDto | PaginationRequiredDto,
>(
  dto: T,
) => {
  let { page, limit } = dto

  if (page === undefined && limit === undefined) {
    if (dto instanceof PaginationRequiredDto) {
      page = Constants.PAGINATION.DEFAULT_PAGE
      limit = Constants.PAGINATION.DEFAULT_LIMIT
    } else if (dto instanceof PaginationOptionalDto) {
      return {}
    } else {
      throw new BadRequestException(Messages.PAGINATION.UNKNOWN_DTO_TYPE)
    }
  }

  if (page !== undefined && limit === undefined) {
    limit = Constants.PAGINATION.DEFAULT_LIMIT
  }

  if (limit !== undefined && page === undefined) {
    page = Constants.PAGINATION.DEFAULT_PAGE
  }

  return {
    skip: (page - 1) * limit,
    take: limit,
  }
}
