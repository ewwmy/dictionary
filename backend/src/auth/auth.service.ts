import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'

import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { RegisterUserDto } from './dto/register.user.dto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwt: JwtService,
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

  async register(dto: RegisterUserDto) {
    const user = await this.userService.create(dto)
    return this.login(user)
  }
}
