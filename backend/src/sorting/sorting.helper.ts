import { SortingDto, SortOrder, SORT_ORDER_DEFAULT } from './sorting.dto'

export type SortingData = {
  [key: string]: SortOrder
}

export const getSorting = (dto: SortingDto): SortingData => {
  let { sortBy, sortOrder } = dto

  if (!sortOrder) {
    sortOrder = SORT_ORDER_DEFAULT
  }

  if (!sortBy) {
    return {}
  }

  sortBy = sortBy as string
  sortOrder = sortOrder as SortOrder

  return {
    [sortBy]: sortOrder,
  }
}
