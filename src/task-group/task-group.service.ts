import { Injectable } from '@nestjs/common';
import {
  AnalyticsService,
  IAnalytics,
} from '../utils/analytics/analytics.service';
import { DataSource } from 'typeorm';
import { TaskGroup } from './entities/task-group.entity';
import { get } from 'lodash';
import { ITaskGroupCreatePayload, ITaskGroupUpdatePayload } from './types';

@Injectable()
export class TaskGroupService {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly dataSource: DataSource,
  ) {}

  // method creates task group
  async create(
    createTaskGroupDto: ITaskGroupCreatePayload,
  ): Promise<IAnalytics<string | Error>> {
    try {
      // create task group
      const taskGroupCreateRes = await this.dataSource
        .getRepository(TaskGroup)
        .insert(createTaskGroupDto);

      // define task group id
      const taskGroupId = get(taskGroupCreateRes, 'identifiers[0].id');

      // success analytics
      return this.analytics.success<string>({
        message: 'Task group created.',
        payload: taskGroupId,
      });
    } catch (err) {
      // fail analytics
      return this.analytics.fail<Error>({
        message: 'Task group create fail.',
        payload: err,
      });
    }
  }

  // method updates task group
  async update({
    taskGroupUpdateDto,
    taskGroupId,
  }: ITaskGroupUpdatePayload): Promise<IAnalytics<string | Error>> {
    try {
      // update task group
      await this.dataSource
        .getRepository(TaskGroup)
        .update({ id: taskGroupId }, taskGroupUpdateDto);

      // success analytics
      return this.analytics.success<string>({
        message: 'Task group updated.',
        payload: taskGroupId,
      });
    } catch (err) {
      // fail analytics
      return this.analytics.fail<Error>({
        message: 'Task group update fail.',
        payload: err,
      });
    }
  }

  // method removes task group
  async remove(taskGroupId: string): Promise<IAnalytics<string | Error>> {
    try {
      // remove task group
      await this.dataSource
        .getRepository(TaskGroup)
        .delete({ id: taskGroupId });

      // success analytics
      return this.analytics.success<string>({
        message: 'Task group removed.',
        payload: taskGroupId,
      });
    } catch (err) {
      // fail analytics
      return this.analytics.fail<Error>({
        message: 'Task group remove fail.',
        payload: err,
      });
    }
  }

  // method returns task groups by board
  async findByBoard(boardId: string): Promise<IAnalytics<TaskGroup[] | Error>> {
    try {
      // find task group by board
      const taskGroups = await this.dataSource
        .getRepository(TaskGroup)
        .find({
          where: { board: { id: boardId } },
          relations: ['tasks', 'owner'],
        });

      // success analytics
      return this.analytics.success({
        message: 'Task group find by board success.',
        payload: taskGroups,
      });
    } catch (err) {
      // fail analytics
      return this.analytics.fail<Error>({
        message: 'Task group find by board fail.',
        payload: err,
      });
    }
  }
}
