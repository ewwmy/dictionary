import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'

import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { RegisterUserDto } from './dto/register.user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { RegistrationConfirm, RegistrationMode } from './auth.const'
import { CreateUserDto } from 'src/user/dto/create.user.dto'
import { Messages } from 'src/messages/messages.const'

@Injectable()
export class AuthService {
  private readonly registrationMode =
    this.configService.get('REGISTRATION_MODE') || RegistrationMode.Invite

  private readonly registrationConfirm =
    this.configService.get('REGISTRATION_CONFIRM') || RegistrationConfirm.Manual

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email)
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException(Messages.AUTH.INVALID_CREDENTIALS)
    }

    if (!user.isActive) {
      throw new ForbiddenException(Messages.AUTH.PENDING_APPROVAL)
    }

    return user
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email }
    return {
      access_token: this.jwt.sign(payload),
    }
  }

  async register(dto: RegisterUserDto, inviteToken?: string) {
    const createUserDto: CreateUserDto = dto

    if (this.registrationMode === RegistrationMode.Invite) {
      createUserDto.inviteTokenId = await this.validateInviteToken(inviteToken)
    }

    if (this.registrationConfirm === RegistrationConfirm.Auto) {
      createUserDto.isActive = true
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (existing) {
      throw new ConflictException(Messages.AUTH.EMAIL_CONFLICT)
    }

    const user = await this.userService.create(createUserDto)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }

  private async validateInviteToken(token?: string) {
    if (!token) {
      throw new ForbiddenException(Messages.AUTH.TOKEN_REQUIRED)
    }

    const invite = await this.prisma.inviteToken.findUnique({
      where: { token },
    })

    if (!invite) {
      throw new ForbiddenException(Messages.AUTH.TOKEN_INVALID)
    }

    if (invite.timeExpiration && invite.timeExpiration < new Date()) {
      throw new ForbiddenException(Messages.AUTH.TOKEN_EXPIRED)
    }

    if (invite.isUsed) {
      throw new ForbiddenException(Messages.AUTH.TOKEN_USED)
    }

    // mark as used
    await this.prisma.inviteToken.update({
      where: { token },
      data: { isUsed: true },
    })

    return invite.id
  }
}
