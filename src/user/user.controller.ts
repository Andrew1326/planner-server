import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { AnalyticsService } from '../utils/analytics/analytics.service';
import { Response, Request } from 'express';
import { get } from 'lodash';
import { ISessionUser } from './types';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { User } from './entities/user.entity';
import { ProjectService } from '../project/project.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly analytics: AnalyticsService,
    private readonly projectService: ProjectService,
  ) {}

  // route for user creation
  @Post()
  async create(@Body() userCreateDto: UserCreateDto, @Res() res: Response) {
    // trying to find user by email
    const userGetRes = await this.userService.getByEmail(userCreateDto.email);

    // fail if user with current email was found => email must be unique
    if (userGetRes.success) {
      const emailExistsAnalytics = this.analytics.fail({
        message: 'Fail, user with this email already exists.',
        id: 'USER.CONTROLLER.CREATE_DUPLICATE_EMAIL',
      });

      return res.status(HttpStatus.BAD_REQUEST).json(emailExistsAnalytics);
    }

    // create user
    const userCreateRes = await this.userService.create(userCreateDto);

    // define http status based on result
    const httpStatus = this.analytics.defineHttpStatus(userCreateRes);

    res.status(httpStatus).json(userCreateRes);
  }

  // route for user info receiving
  @UseGuards(AuthJwtGuard)
  @Get('current')
  async currentInfo(@Req() req: Request, @Res() res: Response) {
    const sessionUser = get(req, 'user') as ISessionUser;
    const email = get(sessionUser, 'email', '');

    // trying to find user by email
    const userGetRes = await this.userService.getByEmail(email);

    // define http status based on user creation result
    let httpStatus: number = HttpStatus.BAD_REQUEST;

    // setup success status
    if (userGetRes.success) {
      httpStatus = HttpStatus.OK;

      // delete user password, we mustn't show it on the client side
      delete (userGetRes.payload as User).password;
    }

    res.status(httpStatus).json(userGetRes);
  }

  // route for receiving user project
  @UseGuards(AuthJwtGuard)
  @Get('current/project')
  async projectFindByUser(@Req() req: Request, @Res() res: Response) {
    const sessionUser = get(req, 'user') as ISessionUser;
    const email = get(sessionUser, 'email', '');

    // trying to find user by email
    const userGetRes = await this.userService.getByEmail(email);

    // define user id
    const userId: string = get(userGetRes, 'payload.id', '');

    // find projects
    const projectFindRes = await this.projectService.findByUser(userId);

    // define http status based on project find result
    const httpStatus: number = this.analytics.defineHttpStatus(projectFindRes);

    res.status(httpStatus).json(projectFindRes);
  }
}
