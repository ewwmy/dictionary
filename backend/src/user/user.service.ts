import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { CreateUserDto } from './dto/create.user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  getAllUsers() {
    return this.prisma.user.findMany()
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password,
      Number(this.config.get('PASSWORD_ROUNDS')),
    )
  }

  async create(data: CreateUserDto) {
    const hashedPassword = await this.hashPassword(data.password)

    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        inviteTokenId: data.inviteTokenId ? data.inviteTokenId : null,
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    })
  }
}
