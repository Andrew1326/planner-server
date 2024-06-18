import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TaskGroup } from './entities/task-group.entity';
import { get } from 'lodash';
import {
  ISafeTaskGroup,
  ITaskGroupCreatePayload,
  ITaskGroupUpdatePayload,
} from './types';
import { instanceToPlain } from 'class-transformer';
import { AnalyticsService } from '../utils/analytics/analytics.service';

@Injectable()
export class TaskGroupService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly analyticsService: AnalyticsService,
  ) {}

  // method creates task group
  async create(createTaskGroupDto: ITaskGroupCreatePayload) {
    return this.analyticsService.provide<string>({
      successMessage: 'Task group create success',
      failureMessage: 'Task group create fail',
      id: 'TASK-GROUP.SERVICE.CREATE',
    })(async () => {
      // create task group
      const taskGroupCreateRes = await this.dataSource
        .getRepository(TaskGroup)
        .insert(createTaskGroupDto);

      // define task group id
      const taskGroupId = get(taskGroupCreateRes, 'identifiers[0].id');

      return taskGroupId;
    });
  }

  // method updates task group
  async update({ taskGroupUpdateDto, taskGroupId }: ITaskGroupUpdatePayload) {
    return this.analyticsService.provide<string>({
      successMessage: 'Task group update success',
      failureMessage: 'Task group update fail',
      id: 'TASK-GROUP.SERVICE.UPDATE',
    })(async () => {
      // update task group
      await this.dataSource
        .getRepository(TaskGroup)
        .update({ id: taskGroupId }, taskGroupUpdateDto);

      return taskGroupId;
    });
  }

  // method removes task group
  async remove(taskGroupId: string) {
    return this.analyticsService.provide<string>({
      successMessage: 'Task group remove success',
      failureMessage: 'Task group remove fail',
      id: 'TASK-GROUP.SERVICE.REMOVE',
    })(async () => {
      // remove task group
      await this.dataSource
        .getRepository(TaskGroup)
        .delete({ id: taskGroupId });

      return taskGroupId;
    });
  }

  // method finds task group by id
  async findById(taskGroupId: string) {
    return this.analyticsService.provide<TaskGroup>({
      successMessage: 'Task group by id success',
      failureMessage: 'Task group by id fail',
      id: 'TASK-GROUP.SERVICE.FIND_BY_ID',
    })(async () => {
      // find task group by id
      const taskGroup = await this.dataSource
        .getRepository(TaskGroup)
        .findOne({ where: { id: taskGroupId }, relations: ['tasks', 'owner'] });

      // convert task group to plain
      const taskGroupPlain = instanceToPlain(taskGroup);

      return taskGroupPlain;
    });
  }

  // method returns task groups by board
  async findByBoard(boardId: string) {
    return this.analyticsService.provide<TaskGroup[]>({
      successMessage: 'Task group find by board success',
      failureMessage: 'Task group find by board fail',
      id: 'TASK-GROUP.SERVICE.FIND_BY_BOARD',
    })(async () => {
      // find task group by board
      const taskGroups = await this.dataSource.getRepository(TaskGroup).find({
        where: { board: { id: boardId } },
        relations: ['tasks', 'owner'],
      });

      // convert task groups to plain
      const taskGroupsPlain = taskGroups.map((group) =>
        instanceToPlain(group),
      ) as ISafeTaskGroup[];

      return taskGroupsPlain;
    });
  }
}
