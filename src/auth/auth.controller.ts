import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthLocalGuard } from './auth-local.guard';
import { AuthService } from './auth.service';
import { get } from 'lodash';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthLocalGuard)
  @Post('/login')
  async login(@Request() req) {
    const user = get(req, 'user');

    return this.authService.login(user);
  }
}
