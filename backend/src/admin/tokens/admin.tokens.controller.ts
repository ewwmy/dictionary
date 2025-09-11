import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
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

@UseGuards(JwtAuthGuard, RolesGuard)
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
      throw new NotFoundException('Token not found')
    }
    return candidate
  }

  @Get()
  getAll(
    @Query('page', new DefaultValuePipe(1)) page,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit,
  ) {
    if (page < 1) {
      throw new BadRequestException('Page cannot be less than 1')
    }
    if (limit < 1) {
      throw new BadRequestException('Limit cannot be less than 1')
    }
    return this.prisma.inviteToken.findMany({
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.getCandidate(id)
  }

  @Post()
  async generate(
    @Query('amount', new DefaultValuePipe(1), ParseIntPipe) amount,
  ) {
    if (amount < 1) {
      throw new BadRequestException('Amount cannot be less than 1')
    }
    if (amount > 100) {
      throw new BadRequestException('Amount cannot be more than 100')
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
  async delete(@Param('id', ParseIntPipe) id: number) {
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
