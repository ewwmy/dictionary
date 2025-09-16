import { PaginationDto } from 'src/pagination/pagination.dto'
import { SortingDto } from './sorting.dto'
import { IntersectionType } from '@nestjs/mapped-types'
import { IsOptional, IsIn } from 'class-validator'
import { Expose } from 'class-transformer'

export const WORDS_SORT_FIELDS = ['word', 'timeCreate', 'timeEdit'] as const

export type WordsSortField = (typeof WORDS_SORT_FIELDS)[number]

export class WordsSortingDto extends SortingDto<WordsSortField> {
  @IsOptional()
  @IsIn(WORDS_SORT_FIELDS)
  @Expose({ name: 'sort_by' })
  sortBy?: WordsSortField
}

export class WordPaginationAndSortingDto extends IntersectionType(
  PaginationDto,
  WordsSortingDto,
) {}
