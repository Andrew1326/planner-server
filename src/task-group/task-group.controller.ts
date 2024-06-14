import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Req,
  Res, UseGuards
} from "@nestjs/common";
import { TaskGroupService } from './task-group.service';
import { TaskGroupCreateDto } from './dto/task-group-create.dto';
import { TaskGroupUpdateDto } from './dto/task-group-update.dto';
import { get } from 'lodash';
import { ISessionUser } from '../user/types';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { ITaskGroupCreatePayload } from './types';
import { AuthJwtGuard } from "../auth/auth-jwt.guard";

@Controller('task_group')
export class TaskGroupController {
  constructor(
    private readonly taskGroupService: TaskGroupService,
    private readonly userService: UserService,
  ) {}

  // route for task group creation
  @UseGuards(AuthJwtGuard)
  @Post()
  async create(
    @Body() taskGroupCreateDto: TaskGroupCreateDto,
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

    // define task group owner id
    const taskGroupOwnerId: string = get(userGetRes, 'payload.id', '');

    // define task group create payload
    const taskGroupCreatePayload: ITaskGroupCreatePayload = {
      ...taskGroupCreateDto,
      owner: taskGroupOwnerId,
    };

    // create task group
    const taskGroupCreateRes = await this.taskGroupService.create(
      taskGroupCreatePayload,
    );

    // define http status based on task group creation result
    const httpStatus: number = taskGroupCreateRes.fail
      ? HttpStatus.OK
      : HttpStatus.BAD_REQUEST;

    res.status(httpStatus).json(taskGroupCreateRes);
  }

  // route for task group modification
  @UseGuards(AuthJwtGuard)
  @Patch(':id')
  async update(
    @Param('id') taskGroupId: string,
    @Body() taskGroupUpdateDto: TaskGroupUpdateDto,
    @Res() res: Response,
  ) {
    // update task group
    const taskGroupUpdateRes = await this.taskGroupService.update({
      taskGroupId,
      taskGroupUpdateDto,
    });

    // define http status
    const httpStatus: number = taskGroupUpdateRes.fail
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;

    res.status(httpStatus).json(taskGroupUpdateRes);
  }

  // route for task group deletion
  @UseGuards(AuthJwtGuard)
  @Delete(':id')
  async remove(@Param('id') taskGroupId: string, @Res() res: Response) {
    // remove task group
    const taskGroupRemoveRes = await this.taskGroupService.remove(taskGroupId);

    // define http status
    const httpStatus: number = taskGroupRemoveRes.fail
      ? HttpStatus.BAD_REQUEST
      : HttpStatus.OK;

    res.status(httpStatus).json(taskGroupRemoveRes);
  }
}
