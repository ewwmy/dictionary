import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'

import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email)
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email }
    return {
      access_token: this.jwt.sign(payload),
    }
  }

  async register(dto: { name: string; email: string; password: string }) {
    const user = await this.userService.create(dto)
    return this.login(user)
  }
}
