import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { pick } from 'lodash';
import {
  AnalyticsService,
  IAnalytics,
} from '../utils/analytics/analytics.service';
import { EncryptorService } from '../utils/encryptor/encryptor.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

export interface ILocalCredentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly encryptor: EncryptorService,
    private readonly analytics: AnalyticsService,
    private readonly userService: UserService,
  ) {}

  // method handlers user login (generates jwt)
  async login(
    user: Pick<User, 'email' | 'name'>,
  ): Promise<IAnalytics<string | Error>> {
    const payload = pick(user, 'email', 'name', 'roles');

    try {
      // create jwt token based on payload
      const accessToken = await this.jwtService.signAsync(payload);

      return this.analytics.success({
        message: 'Token generated',
        payload: accessToken,
      });
    } catch (err) {
      return this.analytics.fail({
        message: 'Token not generated',
        payload: err as Error,
      });
    }
  }

  // function is used to validate user using credentials (email and password)
  async validateUser({ email, password }: ILocalCredentials): Promise<any> {
    // get user by email
    const userGetRes = await this.userService.getByEmail(email);

    // return error if user wasn't found
    if (userGetRes.fail) return userGetRes;

    const user = userGetRes.payload as User;

    // check if passwords match
    const passwordMatch = await this.encryptor.compare({
      plainStr: password,
      hash: user.password,
    });

    // fail if the password doesn't match
    if (!passwordMatch)
      return this.analytics.fail({
        message: 'Incorrect password',
        payload: null,
      });

    return this.analytics.success({
      message: 'User found. Passwords match',
      payload: user,
    });
  }
}
