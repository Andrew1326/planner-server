import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TaskGroup } from './entities/task-group.entity';
import { get } from 'lodash';
import {
  ISafeTaskGroup,
  ITaskGroupCreatePayload,
  ITaskGroupUpdatePayload,
} from './types';
import safeExecute from '../utils/safe-execute/safeExecute';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class TaskGroupService {
  constructor(private readonly dataSource: DataSource) {}

  // method creates task group
  async create(createTaskGroupDto: ITaskGroupCreatePayload) {
    return safeExecute<string>({
      successMessage: 'Task group created',
      failureMessage: 'Task group create fail',
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
    return safeExecute<string>({
      successMessage: 'Task group updated',
      failureMessage: 'Task group update fail',
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
    return safeExecute<string>({
      successMessage: 'Task group removed',
      failureMessage: 'Task group remove fail',
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
    return safeExecute<TaskGroup>({
      successMessage: 'Task group was found',
      failureMessage: 'Task group find by id fail',
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
    return safeExecute<TaskGroup[]>({
      successMessage: 'Task group find by board success',
      failureMessage: 'Task group find by board fail',
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
