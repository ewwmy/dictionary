import { PaginationDto } from './pagination.dto'
import {
  getPagination,
  PaginationConfig,
  isPaginationEmpty,
} from './pagination.helper'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  hasNext: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: PaginationMeta | null
}

export async function paginate<T>(
  model: any,
  dto: PaginationDto,
  prismaOptions: any = {},
  config: PaginationConfig = { force: false },
): Promise<PaginatedResult<T>> {
  const pagination = getPagination(dto, config)

  let { page, limit } = pagination.query
  let { skip, take } = pagination.dbOptions

  if (isPaginationEmpty(pagination.dbOptions)) {
    const data = await model.findMany(prismaOptions)
    return {
      data,
      pagination: null,
    }
  } else {
    skip = skip as number
    take = take as number
    page = page as number
    limit = limit as number

    const [data, total] = await Promise.all([
      model.findMany({
        ...prismaOptions,
        skip,
        take,
      }),
      model.count({ where: prismaOptions?.where }),
    ])

    let totalFixed = 0

    if (typeof total === 'object' && total !== null) {
      for (const key in total) {
        if (total[key] > totalFixed) {
          totalFixed = total[key]
        }
      }
    } else {
      totalFixed = total
    }

    return {
      data,
      pagination: {
        page,
        limit,
        total: totalFixed,
        hasNext: skip + take < total,
      },
    }
  }
}
