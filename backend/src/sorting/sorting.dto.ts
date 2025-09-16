// sorting.dto.ts
import { Expose, Transform } from 'class-transformer'
import { IsOptional, IsIn } from 'class-validator'

export const SORT_DIRECTIONS = ['asc', 'desc'] as const
export const SORT_DIRECTION_DEFAULT = SORT_DIRECTIONS[0]

export type SortDirection = (typeof SORT_DIRECTIONS)[number]

export class SortingDto<TFields extends string = string> {
  @IsOptional()
  @IsIn([])
  @Expose({ name: 'sort_by' })
  sortBy?: TFields

  @IsOptional()
  @IsIn(SORT_DIRECTIONS)
  @Expose({ name: 'sort_order' })
  @Transform(({ value }) => value ?? SORT_DIRECTION_DEFAULT)
  sortOrder?: SortDirection = SORT_DIRECTION_DEFAULT
}
