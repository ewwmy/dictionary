import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ActiveUserGuard } from 'src/auth/is-active.guard'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PrismaService } from 'src/prisma/prisma.service'
import { WordsService } from './words.service'
import { Messages } from 'src/messages/messages.const'
import { PaginationRequiredDto } from 'src/pagination/pagination.required.dto'
import { getPagination } from 'src/pagination/pagination.helper'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CreateWordDto } from './dto/create-word.dto'
import { LanguagesService } from 'src/languages/languages.service'
import { SearchWordDto } from './dto/search-word.dto'
import { UpdateWordDto } from './dto/update-word.dto'
import { PaginationOptionalDto } from 'src/pagination/pagination.optional.dto'

@UseGuards(JwtAuthGuard, ActiveUserGuard)
@Controller()
export class WordsController {
  constructor(
    private readonly wordsService: WordsService,
    private readonly languagesService: LanguagesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('languages/:id/words')
  async getAll(
    @Param('id') languageId: number,
    @Query() query: PaginationRequiredDto,
    @CurrentUser('id') userId: number,
  ) {
    await this.languagesService.getCandidate(languageId, userId)

    const { skip, take } = getPagination(query)

    const result = await this.prisma.word.findMany({
      skip,
      take,
      where: {
        languageId,
      },
    })

    const total = await this.prisma.word.count({
      where: {
        languageId,
      },
    })

    return {
      data: result,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: total,
        hasNext: skip + take < total,
      },
    }
  }

  @Get('words/:id')
  getOne(@Param('id') id: number, @CurrentUser('id') userId: number) {
    return this.wordsService.getCandidate(id, userId)
  }

  @HttpCode(200)
  @Post('words/search')
  async search(
    @Body() dto: SearchWordDto,
    @Query() query: PaginationOptionalDto,
    @CurrentUser('id') userId: number,
  ) {
    if (dto.languageId) {
      await this.languagesService.getCandidate(dto.languageId, userId)
    }

    const { skip, take } = getPagination(query)

    return await this.prisma.word.findMany({
      where: {
        ...(dto.languageId && { languageId: dto.languageId }),
        languageId: {
          in: (await this.languagesService.getAll(userId)).map(l => l.id),
        },
        OR: [
          { word: { contains: dto.search, mode: 'insensitive' } },
          { word2: { contains: dto.search, mode: 'insensitive' } },
          { word3: { contains: dto.search, mode: 'insensitive' } },
          { translation: { contains: dto.search, mode: 'insensitive' } },
        ],
      },
      include: {
        ...(!dto.languageId && { language: true }),
      },
      skip,
      take,
    })
  }

  @HttpCode(200)
  @Post('languages/:id/words')
  async create(
    @Param('id') languageId: number,
    @Body() dto: CreateWordDto,
    @CurrentUser('id') userId: number,
  ) {
    await this.languagesService.getCandidate(languageId, userId)

    const candidate = await this.prisma.word.findUnique({
      where: {
        languageId_word: {
          languageId,
          word: dto.word,
        },
      },
    })

    if (candidate) {
      throw new ConflictException(Messages.WORD.NAME_CONFLICT)
    }

    return this.prisma.word.create({
      data: {
        ...dto,
        languageId,
      },
    })
  }

  @Patch('words/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateWordDto,
    @CurrentUser('id') userId: number,
  ) {
    await this.wordsService.getCandidate(id, userId)
    return this.prisma.word.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    })
  }

  @Delete('words/:id')
  async delete(@Param('id') id: number, @CurrentUser('id') userId: number) {
    await this.wordsService.getCandidate(id, userId)
    return this.prisma.word.delete({
      where: {
        id,
      },
    })
  }
}
