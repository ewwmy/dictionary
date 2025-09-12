import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateLanguageDto } from './dto/create-language.dto'
import { Messages } from 'src/messages/messages.const'
import { UpdateLanguageDto } from './dto/update-language.dto'
import { ActiveUserGuard } from 'src/auth/is-active.guard'

@UseGuards(JwtAuthGuard, ActiveUserGuard)
@Controller('languages')
export class LanguagesController {
  constructor(private readonly prisma: PrismaService) {}

  private async getCandidate(id: number, userId: number) {
    const candidate = await this.prisma.language.findUnique({
      where: {
        id,
      },
    })
    if (!candidate) {
      throw new NotFoundException(Messages.LANGUAGE.NOT_FOUND)
    }
    if (candidate.userId !== userId) {
      throw new ForbiddenException(Messages.LANGUAGE.FORBIDDEN)
    }
    return candidate
  }

  @Get()
  getAll(@CurrentUser('id') userId: number) {
    return this.prisma.language.findMany({
      where: {
        userId,
      },
    })
  }

  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.getCandidate(id, userId)
  }

  @HttpCode(200)
  @Post()
  async create(
    @Body() dto: CreateLanguageDto,
    @CurrentUser('id') userId: number,
  ) {
    const candidate = await this.prisma.language.findUnique({
      where: {
        userId_name: {
          userId,
          name: dto.name,
        },
      },
    })

    if (candidate) {
      throw new ConflictException(Messages.LANGUAGE.NAME_CONFLICT)
    }

    return this.prisma.language.create({
      data: {
        ...dto,
        userId,
      },
    })
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLanguageDto,
    @CurrentUser('id') userId: number,
  ) {
    await this.getCandidate(id, userId)

    return this.prisma.language.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    })
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    await this.getCandidate(id, userId)
    return this.prisma.language.delete({
      where: {
        id,
      },
    })
  }
}
