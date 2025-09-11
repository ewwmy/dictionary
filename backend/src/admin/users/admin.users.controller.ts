import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
  ConflictException,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Roles } from 'src/roles/roles.decorator'
import { RolesGuard } from 'src/roles/roles.guard'
import { AdminUsersService } from './admin.users.service'
import { PrismaService } from 'src/prisma/prisma.service'

@UseGuards(JwtAuthGuard, RolesGuard)
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
      throw new NotFoundException('User not found')
    }
    return candidate
  }

  @Get()
  getUsers() {
    return this.prisma.user.findMany({
      select: this.fieldList,
    })
  }

  @Get('pending')
  getPendingUsers() {
    return this.prisma.user.findMany({
      select: this.fieldList,
      where: {
        isActive: false,
      },
    })
  }

  @HttpCode(200)
  @Post(':id/activate')
  async activateUser(@Param('id', ParseIntPipe) id: number) {
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
  async deactivateUser(@Param('id', ParseIntPipe) id: number) {
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
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Request() req) {
    if (req?.user?.id === id) {
      throw new ConflictException('You cannot delete yourself')
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
