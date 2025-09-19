import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
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
import { PaginationDto } from 'src/pagination/pagination.dto'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CreateWordDto } from './dto/create-word.dto'
import { LanguagesService } from 'src/languages/languages.service'
import { SearchWordDto } from './dto/search-word.dto'
import { UpdateWordDto } from './dto/update-word.dto'
import { paginate } from 'src/pagination/paginate.helper'
import { WordPaginationAndSortingDto } from 'src/sorting/words.sorting.dto'
import { getSorting } from 'src/sorting/sorting.helper'
import { Public } from 'src/auth/decorators/public.decorator'
import { randomUUID } from 'crypto'
import { ImportService } from 'src/importer/import.service'
import { ImportFromTextDto } from 'src/importer/import.from-text.dto'

@UseGuards(JwtAuthGuard, ActiveUserGuard)
@Controller()
export class WordsController {
  constructor(
    private readonly wordsService: WordsService,
    private readonly languagesService: LanguagesService,
    private readonly importService: ImportService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('languages/:id/words')
  async getAll(
    @Param('id') languageId: number,
    @Query() query: WordPaginationAndSortingDto,
    @CurrentUser('id') userId: number,
  ) {
    await this.languagesService.getCandidate(languageId, userId)

    return await paginate(
      this.prisma.word,
      query,
      {
        where: {
          languageId,
        },
        orderBy: getSorting(query),
      },
      { force: true },
    )
  }

  @Get('words/:id')
  getOne(@Param('id') id: number, @CurrentUser('id') userId: number) {
    return this.wordsService.getCandidate(id, userId)
  }

  @Get('languages/:id/words/random')
  async getRandom(
    @Param('id') languageId: number,
    @CurrentUser('id') userId: number,
  ) {
    await this.languagesService.getCandidate(languageId, userId)

    const total = await this.prisma.word.count({
      where: { languageId },
    })

    if (total === 0) {
      throw new NotFoundException(Messages.WORD.NOT_FOUND)
    }

    const randomIndex = Math.floor(Math.random() * total)

    return await this.prisma.word.findFirst({
      where: { languageId },
      skip: randomIndex,
    })
  }

  @Public()
  @Get('words/shared/:token')
  async getShared(@Param('token') token: string) {
    const candidate = await this.prisma.word.findUnique({
      where: {
        shareToken: token,
      },
      select: {
        word: true,
        word2: true,
        word3: true,
        translation: true,
        description: true,
        transcriptionPhonetic: true,
        transcriptionStrict: true,
        language: {
          select: {
            name: true,
          },
        },
        level: {
          select: {
            name: true,
          },
        },
      },
    })
    if (!candidate) {
      throw new NotFoundException(Messages.WORD.NOT_FOUND)
    }
    return candidate
  }

  @HttpCode(200)
  @Post('words/search')
  async search(
    @Body() dto: SearchWordDto,
    @Query() query: PaginationDto,
    @CurrentUser('id') userId: number,
  ) {
    if (dto.languageId) {
      await this.languagesService.getCandidate(dto.languageId, userId)
    }

    return await paginate(
      this.prisma.word,
      query,
      {
        where: {
          languageId: {
            in: dto.languageId
              ? [dto.languageId]
              : (await this.languagesService.getAll(userId)).map(l => l.id),
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
      },
      { force: true },
    )
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

  @HttpCode(200)
  @Post('languages/:id/words/import/text')
  async importFromText(
    @Param('id') languageId: number,
    @Body() dto: ImportFromTextDto,
    @CurrentUser('id') userId: number,
  ) {
    await this.languagesService.getCandidate(languageId, userId)

    return this.importService.importFromText(dto.data)
  }

  @HttpCode(200)
  @Post('words/:id/share')
  async share(@Param('id') id: number, @CurrentUser('id') userId: number) {
    await this.wordsService.getCandidate(id, userId)
    return this.prisma.word.update({
      where: {
        id,
      },
      data: {
        shareToken: randomUUID(),
      },
    })
  }

  @HttpCode(200)
  @Post('words/:id/unshare')
  async unshare(@Param('id') id: number, @CurrentUser('id') userId: number) {
    await this.wordsService.getCandidate(id, userId)
    return this.prisma.word.update({
      where: {
        id,
      },
      data: {
        shareToken: null,
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
