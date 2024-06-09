import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDTO } from './user.dto';
import { AnalyticsService } from '../util/analytics/analytics.service';
import { Response } from 'express';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly analytics: AnalyticsService,
  ) {}

  @Post('/')
  async userCreate(@Body() userDTO: UserCreateDTO, @Res() res: Response) {
    // trying to find user by email
    const userGetRes = await this.userService.userGetByEmail(userDTO.email);

    // fail if user with current email was found => email must be unique
    if (userGetRes.success) {
      const emailExistsAnalytics = this.analytics.fail({
        message: 'Fail, user with this email already exists.',
      });

      return res.status(HttpStatus.BAD_REQUEST).json(emailExistsAnalytics);
    }

    // create user
    const userCreateRes = await this.userService.userCreate(userDTO);

    const httpStatus = this.analytics.defineHttpStatus(userCreateRes);

    res.status(httpStatus).json(userCreateRes);
  }
}
