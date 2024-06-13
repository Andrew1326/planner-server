import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProjectService } from './project.service';
import { ProjectCreateDto } from './dto/project-create.dto';
import { ProjectUpdateDto } from './dto/project-update.dto';
import { ISessionUser } from '../user/types';
import { get } from 'lodash';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {}

  // route for project creation
  @UseGuards(AuthJwtGuard)
  @Post()
  async create(
    @Body() projectCreateDto: ProjectCreateDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const sessionUser = get(req, 'user') as ISessionUser;
    const email = get(sessionUser, 'email', '');

    // get user by email
    const userGetRes = await this.userService.getByEmail(email);

    // fail if user wasn't received
    if (userGetRes.fail) {
      return res.status(HttpStatus.BAD_REQUEST).json(userGetRes);
    }

    // define project owner
    const projectOwner = userGetRes.payload as User;

    // create project
    const projectCreateRes = await this.projectService.create({
      projectCreateDto,
      owner: projectOwner,
    });

    // define http status based on project creation result
    const httpStatus: number = projectCreateRes.fail
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;

    res.status(httpStatus).json(projectCreateRes);
  }

  // route for all project receiving
  @Get()
  async findAll(@Res() res: Response) {
    // find all project
    const projectFindAllRes = await this.projectService.findAll();

    // define http status based on project find all result
    const httpStatus: number = projectFindAllRes.fail
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;

    res.status(httpStatus).json(projectFindAllRes);
  }

  // route for receiving project by id
  @Get(':id')
  async findById(@Param('id') projectId: string, @Res() res: Response) {
    // find all project
    const projectFindRes = await this.projectService.findById(projectId);

    // define http status based on project find result
    const httpStatus: number = projectFindRes.fail
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;

    res.status(httpStatus).json(projectFindRes);
  }

  // route for project modification
  @Patch(':id')
  async update(
    @Param('id') projectId: string,
    @Body() projectUpdateDto: ProjectUpdateDto,
    @Res() res: Response,
  ) {
    // update project
    const projectUpdateRes = await this.projectService.update({
      projectId,
      projectUpdateDto,
    });

    // define http status based on project update result
    const httpStatus: number = projectUpdateRes.fail
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;

    res.status(httpStatus).json(projectUpdateRes);
  }

  // route for project deletion
  @Delete(':id')
  async remove(@Param('id') projectId: string, @Res() res: Response) {
    // remove project
    const removeProjectRes = await this.projectService.remove(projectId);

    // define http status based on project update result
    const httpStatus: number = removeProjectRes.fail
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;

    res.status(httpStatus).json(removeProjectRes);
  }
}
