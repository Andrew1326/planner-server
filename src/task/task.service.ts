import { Injectable } from '@nestjs/common';
import { TaskCreateDto } from './dto/task-create.dto';
import { DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import { ITaskUpdatePayload } from './types';
import { instanceToPlain } from 'class-transformer';
import { AnalyticsService } from '../utils/analytics/analytics.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly analyticsService: AnalyticsService,
  ) {}

  // method for task creation
  create(taskCreateDto: TaskCreateDto) {
    return this.analyticsService.provideAnalytics<string>({
      successMessage: 'Task create success',
      failureMessage: 'Task create fail',
      id: 'TASK.SERVICE.CREATE',
    })(async () => {
      // create task
      const taskCreateRes = await this.dataSource
        .getRepository(Task)
        .insert(taskCreateDto);

      // define created task id
      const taskId = taskCreateRes.identifiers[0].id;

      return taskId;
    });
  }

  // method updates task
  update({ taskId, taskUpdateDto }: ITaskUpdatePayload) {
    return this.analyticsService.provideAnalytics<string>({
      successMessage: 'Task update success',
      failureMessage: 'Task update fail',
      id: 'TASK.SERVICE.UPDATE',
    })(async () => {
      // update task
      await this.dataSource
        .getRepository(Task)
        .update({ id: taskId }, taskUpdateDto);

      return taskId;
    });
  }

  // method removes task by id
  remove(taskId: string) {
    return this.analyticsService.provideAnalytics<string>({
      successMessage: 'Task remove success',
      failureMessage: 'Task remove fail',
      id: 'TASK.SERVICE.REMOVE',
    })(async () => {
      // remove task
      await this.dataSource.getRepository(Task).delete({ id: taskId });

      return taskId;
    });
  }

  // method returns task by task group id
  findByGroupId(groupId: string) {
    return this.analyticsService.provideAnalytics<Task[]>({
      successMessage: 'Tasks by group id success',
      failureMessage: 'Task by group id fail',
      id: 'TASK.SERVICE.FIND_BY_GROUP_ID',
    })(async () => {
      // find tasks by group
      const tasks = await this.dataSource
        .getRepository(Task)
        .find({ where: { group: { id: groupId } } });

      // convert tasks to plain
      const tasksPlain = tasks.map((task) => instanceToPlain(task));

      return tasksPlain;
    });
  }
}
