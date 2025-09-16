import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { Messages } from 'src/messages/messages.const'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { UpdateUserDto } from './dto/update.user.dto'
import { UserService } from './user.service'
import { ActiveUserGuard } from 'src/auth/is-active.guard'

@UseGuards(JwtAuthGuard, ActiveUserGuard)
@Controller('profile')
export class UserController {
  private fieldList = {
    id: true,
    name: true,
    email: true,
    settings: true,
    confirmCode: true,
    resetPasswordToken: true,
    isActive: true,
    timeCreate: true,
    timeEdit: true,
    inviteToken: {
      select: {
        token: true,
      },
    },
  }

  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  private async getCandidate(id: number) {
    const candidate = await this.prisma.user.findUnique({
      select: this.fieldList,
      where: {
        id,
      },
    })
    if (!candidate) {
      throw new NotFoundException(Messages.USER.NOT_FOUND)
    }
    return candidate
  }

  @Get()
  getProfileSelf(@CurrentUser('id') userId: number) {
    return this.getCandidate(userId)
  }

  @Patch()
  async updateProfileSelf(
    @Body() dto: UpdateUserDto,
    @CurrentUser('id') userId: number,
  ) {
    await this.getCandidate(userId)

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
        ...(dto.password !== undefined
          ? { password: await this.userService.hashPassword(dto.password) }
          : {}),
      },
      select: this.fieldList,
    })
  }

  @Delete()
  async deleteProfileSelf(@CurrentUser('id') userId: number) {
    await this.getCandidate(userId)
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
      select: this.fieldList,
    })
  }
}
