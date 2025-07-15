import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'

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

  async create(data: { name: string; email: string; password: string }) {
    const hashed = await bcrypt.hash(
      data.password,
      Number(this.config.get('PASSWORD_ROUNDS')),
    )
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        isActive: true,
      },
    })
  }
}
