import { Expose, Transform } from 'class-transformer'
import { IsOptional, IsIn } from 'class-validator'

export const SORT_ORDERS = ['asc', 'desc'] as const
export const SORT_ORDER_DEFAULT = SORT_ORDERS[0]

export type SortOrder = (typeof SORT_ORDERS)[number]

export class SortingDto<TFields extends string = string> {
  @IsOptional()
  @IsIn([])
  @Expose({ name: 'sort_by' })
  sortBy?: TFields

  @IsOptional()
  @IsIn(SORT_ORDERS)
  @Expose({ name: 'sort_order' })
  @Transform(({ value }) => value ?? SORT_ORDER_DEFAULT)
  sortOrder?: SortOrder = SORT_ORDER_DEFAULT
}
