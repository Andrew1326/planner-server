import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const validateUserRes = await this.authService.validateUser({
      email,
      password,
    });

    // unauthorized if fail
    if (validateUserRes.fail) throw new UnauthorizedException();

    return validateUserRes.payload;
  }
}
