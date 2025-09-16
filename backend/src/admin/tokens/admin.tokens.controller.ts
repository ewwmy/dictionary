import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  Query,
  BadRequestException,
  Post,
  DefaultValuePipe,
  Delete,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Roles } from 'src/roles/roles.decorator'
import { RolesGuard } from 'src/roles/roles.guard'
import { PrismaService } from 'src/prisma/prisma.service'
import { AdminTokensService } from './admin.tokens.service'

import { randomUUID } from 'crypto'
import { Messages } from 'src/messages/messages.const'
import { ActiveUserGuard } from 'src/auth/is-active.guard'
import { PaginationDto } from 'src/pagination/pagination.dto'
import { paginate } from 'src/pagination/paginate.helper'

@UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
@Roles(Role.Admin)
@Controller('admin/tokens')
export class AdminTokensController {
  constructor(
    private readonly tokensService: AdminTokensService,
    private readonly prisma: PrismaService,
  ) {}

  private async getCandidate(id: number) {
    const candidate = await this.prisma.inviteToken.findUnique({
      where: {
        id,
      },
    })
    if (!candidate) {
      throw new NotFoundException(Messages.ADMIN.TOKEN.NOT_FOUND)
    }
    return candidate
  }

  @Get()
  getAll(@Query() query: PaginationDto) {
    return paginate(this.prisma.inviteToken, query)
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.getCandidate(id)
  }

  @Post()
  async generate(@Query('amount', new DefaultValuePipe(1)) amount) {
    if (amount < 1) {
      throw new BadRequestException(Messages.ADMIN.TOKEN.AMOUNT_LESS_ERROR(1))
    }
    if (amount > 100) {
      throw new BadRequestException(Messages.ADMIN.TOKEN.AMOUNT_MORE_ERROR(100))
    }
    const tokens = await this.prisma.$transaction(
      Array.from({ length: amount }, () =>
        this.prisma.inviteToken.create({
          data: { token: randomUUID() },
        }),
      ),
    )
    return tokens
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.getCandidate(id)
    return this.prisma.inviteToken.delete({
      where: {
        id,
      },
    })
  }

  @Delete()
  async deleteUnused() {
    return this.prisma.inviteToken.deleteMany({
      where: {
        isUsed: false,
      },
    })
  }
}
