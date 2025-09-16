import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  ConflictException,
  Query,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Roles } from 'src/roles/roles.decorator'
import { RolesGuard } from 'src/roles/roles.guard'
import { AdminUsersService } from './admin.users.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { Messages } from 'src/messages/messages.const'
import { ActiveUserGuard } from 'src/auth/is-active.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { PaginationDto } from 'src/pagination/pagination.dto'
import { paginate } from 'src/pagination/paginate.helper'

@UseGuards(JwtAuthGuard, RolesGuard, ActiveUserGuard)
@Roles(Role.Admin)
@Controller('admin/users')
export class AdminUsersController {
  private fieldList = {
    id: true,
    role: true,
    name: true,
    email: true,
    confirmCode: true,
    resetPasswordToken: true,
    isActive: true,
    timeCreate: true,
    timeEdit: true,
    inviteToken: true,
  }

  constructor(
    private readonly usersService: AdminUsersService,
    private readonly prisma: PrismaService,
  ) {}

  private async getCandidate(id: number) {
    const candidate = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!candidate) {
      throw new NotFoundException(Messages.ADMIN.USER.NOT_FOUND)
    }
    return candidate
  }

  @Get()
  getUsers(@Query() query: PaginationDto) {
    return paginate(this.prisma.user, query, { select: this.fieldList })
  }

  @Get('pending')
  getPendingUsers(@Query() query: PaginationDto) {
    return paginate(this.prisma.user, query, {
      select: this.fieldList,
      where: { isActive: false },
    })
  }

  @HttpCode(200)
  @Post(':id/activate')
  async activateUser(@Param('id') id: number) {
    await this.getCandidate(id)
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
      select: this.fieldList,
    })
  }

  @HttpCode(200)
  @Post(':id/deactivate')
  async deactivateUser(@Param('id') id: number) {
    await this.getCandidate(id)
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
      select: this.fieldList,
    })
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number, @CurrentUser('id') userId: number) {
    if (userId === id) {
      throw new ConflictException(Messages.ADMIN.USER.SELF_DELETION)
    }
    await this.getCandidate(id)
    return this.prisma.user.delete({
      where: {
        id,
      },
      select: this.fieldList,
    })
  }
}
