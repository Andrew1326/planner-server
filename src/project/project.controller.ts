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
import { BoardService } from '../board/board.service';
import { IProjectCreatePayload } from "./types";

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly boardService: BoardService,
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

    // define project owner id
    const projectOwnerId: string = get(userGetRes, 'payload.id', '');

    // define project create payload
    const projectCreatePayload: IProjectCreatePayload = {
      ...projectCreateDto,
      owner: projectOwnerId,
    }

    // create project
    const projectCreateRes = await this.projectService.create(projectCreatePayload);

    // define http status based on project creation result
    const httpStatus: number = projectCreateRes.fail
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;

    res.status(httpStatus).json(projectCreateRes);
  }

  // route for receiving project by id
  @UseGuards(AuthJwtGuard)
  @Get(':id')
  async findById(@Param('id') projectId: string, @Res() res: Response) {
    // find project by id
    const projectFindRes = await this.projectService.findById(projectId);

    // define http status based on project find result
    const httpStatus: number = projectFindRes.fail
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;

    res.status(httpStatus).json(projectFindRes);
  }

  // route for project modification
  @UseGuards(AuthJwtGuard)
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
  @UseGuards(AuthJwtGuard)
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

  // route for receiving boards by project
  @UseGuards(AuthJwtGuard)
  @Get(':id/board')
  async boardFindByProject(
    @Param('id') projectId: string,
    @Res() res: Response,
  ) {
    // find boards by project
    const boardFindRes = await this.boardService.findByProject(projectId);

    // define http status based on board find result
    const httpStatus: number = boardFindRes.fail
      ? HttpStatus.OK
      : HttpStatus.BAD_REQUEST;

    res.status(httpStatus).json(boardFindRes);
  }
}
