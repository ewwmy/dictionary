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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: { name: string; email: string; password: string }) {
    return this.authService.register(dto)
  }

  @Post('login')
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
