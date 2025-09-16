import { SortingDto } from './sorting.dto'

export const getSorting = (dto: SortingDto) => {
  const { sortBy, sortOrder } = dto

  if (!sortBy) {
    return {}
  }

  return {
    [sortBy]: sortOrder,
  }
}
