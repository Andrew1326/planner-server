import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete, UseGuards, Res
} from "@nestjs/common";
import { TaskService } from './task.service';
import { TaskCreateDto } from './dto/task-create.dto';
import { TaskUpdateDto } from './dto/task-update.dto';
import { AuthJwtGuard } from "../auth/auth-jwt.guard";
import { Response } from 'express'
import { AnalyticsService } from "../utils/analytics/analytics.service";

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService, private readonly analyticsService: AnalyticsService) {}

  // route for task creation
  @UseGuards(AuthJwtGuard)
  @Post()
  async create(@Body() taskCreateDto: TaskCreateDto, @Res() res: Response) {
    // create task
    const taskCreateRes = await this.taskService.create(taskCreateDto);

  // define http status based on creation result
    const httpStatus = this.analyticsService.defineHttpStatus(taskCreateRes);

    res.status(httpStatus).json(taskCreateRes);
  }

  // route for task modification
  @UseGuards(AuthJwtGuard)
  @Patch(':id')
  async update(@Param('id') taskId: string, @Body() taskUpdateDto: TaskUpdateDto, @Res() res: Response) {
    // update task
    const taskUpdateRes = await this.taskService.update({ taskId, taskUpdateDto });

  // define http status based on task modification result
    const httpStatus = this.analyticsService.defineHttpStatus(taskUpdateRes);

    res.status(httpStatus).json(taskUpdateRes);
  }

  // route for task deletion
  @UseGuards(AuthJwtGuard)
  @Delete(':id')
  async remove(@Param('id') taskId: string, @Res() res: Response) {
    // remove task
    const removeTaskRes = await this.taskService.remove(taskId);

  // define http status based on task deletion result
    const httpStatus = this.analyticsService.defineHttpStatus(removeTaskRes);

    res.status(httpStatus).json(removeTaskRes);
  }
}
