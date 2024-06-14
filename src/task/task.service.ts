import { Injectable } from '@nestjs/common';
import { TaskCreateDto } from './dto/task-create.dto';
import safeExecute from "../utils/safe-execute/safeExecute";
import { DataSource } from "typeorm";
import { Task } from "./entities/task.entity";
import { ITaskUpdatePayload } from "./types";

@Injectable()
export class TaskService {
  constructor(private readonly dataSource: DataSource) {
  }

  // method for task creation
  create(taskCreateDto: TaskCreateDto) {
    return safeExecute<string>({ successMessage: 'Task created', failureMessage: 'Task create fail' })(async () => {
    // create task
      const taskCreateRes = await this.dataSource.getRepository(Task).insert(taskCreateDto);

    // define created task id
      const taskId = taskCreateRes.identifiers[0].id;

      return taskId
    })
  }

  // method updates task
  update({ taskId, taskUpdateDto }: ITaskUpdatePayload) {
    return safeExecute<string>({ successMessage: 'Task updated', failureMessage: 'Task update fail' })(async () => {
    // update task
      await this.dataSource.getRepository(Task).update({ id: taskId }, taskUpdateDto);

      return taskId
    })
  }

  // method removes task by id
  remove(taskId: string) {
    return safeExecute<string>({ successMessage: 'Task removed', failureMessage: 'Task remove fail' })(async () => {
      // remove task
      await this.dataSource.getRepository(Task).delete({ id: taskId });

      return taskId
    })
  }
}
