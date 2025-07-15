import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { Throttle } from '@nestjs/throttler'
import { ConfigService } from '@nestjs/config'
import {
  THROTTLE_LOGIN_LIMIT,
  THROTTLE_LOGIN_TTL,
  THROTTLE_REGISTER_LIMIT,
  THROTTLE_REGISTER_TTL,
} from 'src/throttler/throttler.const'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @Throttle({
    default: {
      ttl: THROTTLE_REGISTER_TTL,
      limit: THROTTLE_REGISTER_LIMIT,
    },
  })
  register(@Body() dto: { name: string; email: string; password: string }) {
    return this.authService.register(dto)
  }

  @Post('login')
  @Throttle({
    default: {
      ttl: THROTTLE_LOGIN_TTL,
      limit: THROTTLE_LOGIN_LIMIT,
    },
  })
  async login(@Body() dto: { email: string; password: string }) {
    const user = await this.authService.validateUser(dto.email, dto.password)
    if (!user) throw new UnauthorizedException()
    return this.authService.login(user)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req) {
    return req.user
  }
}
