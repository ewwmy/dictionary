import { Constants } from 'src/constants/constants'
import { PaginationDto } from './pagination.dto'

export type PaginationConfig = { force: boolean }

export type PaginationQueryActive = {
  page: number
  limit: number
}

export type PaginationQueryEmpty = {
  page: undefined
  limit: undefined
}

export type PaginationQuery = PaginationQueryActive | PaginationQueryEmpty

export type PaginationDbOptionsActive = {
  skip: number
  take: number
}

export type PaginationDbOptionsEmpty = {
  skip: undefined
  take: undefined
}

export type PaginationDbOptions =
  | PaginationDbOptionsActive
  | PaginationDbOptionsEmpty

export type PaginationObject = {
  query: PaginationQuery
  dbOptions: PaginationDbOptions
}

export const getPagination = (
  dto: PaginationDto,
  config: PaginationConfig = { force: false },
): PaginationObject => {
  let { page, limit } = dto

  if (!config.force && page === undefined && limit === undefined) {
    return {
      query: {
        page: undefined,
        limit: undefined,
      },
      dbOptions: {
        skip: undefined,
        take: undefined,
      },
    }
  }

  if (page === undefined) {
    page = Constants.PAGINATION.DEFAULT_PAGE
  }

  if (limit === undefined) {
    limit = Constants.PAGINATION.DEFAULT_LIMIT
  }

  limit = limit as number
  page = page as number

  return {
    query: {
      page,
      limit,
    },
    dbOptions: {
      skip: (page - 1) * limit,
      take: limit,
    },
  }
}

export const isPaginationEmpty = (
  dbOptions: PaginationDbOptions,
): dbOptions is PaginationDbOptionsEmpty => {
  return dbOptions.skip === undefined && dbOptions.take === undefined
}
