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

@Injectable()
export class AuthService {
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
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!user.isActive) {
      throw new ForbiddenException('Your account is pending approval')
    }

    return user
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email }
    return {
      access_token: this.jwt.sign(payload),
    }
  }

  private readonly registrationMode = process.env.REGISTRATION_MODE || 'invite' // "open" or "invite"

  async register(dto: RegisterUserDto) {
    if (this.registrationMode === 'invite') {
      await this.validateInviteToken(dto.inviteToken)
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const user = await this.userService.create(dto)
    return this.login(user)
  }

  private async validateInviteToken(token?: string) {
    if (!token) {
      throw new ForbiddenException('Invite token is required')
    }

    const invite = await this.prisma.inviteToken.findUnique({
      where: { token },
    })

    if (!invite) {
      throw new ForbiddenException('Invalid invite token')
    }

    if (invite.timeExpiration && invite.timeExpiration < new Date()) {
      throw new ForbiddenException('Invite token has expired')
    }

    // OPTIONAL: if tokens are one-time use
    // if (invite.used) {
    //   throw new ForbiddenException('Invite token already used');
    // }

    // OPTIONAL: mark as used
    // await this.prisma.inviteToken.update({
    //   where: { token },
    //   data: { used: true },
    // });
  }
}
