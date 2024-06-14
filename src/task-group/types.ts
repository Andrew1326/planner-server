import { TaskGroupCreateDto } from './dto/task-group-create.dto';
import { TaskGroupUpdateDto } from './dto/task-group-update.dto';

export interface ITaskGroupCreatePayload extends TaskGroupCreateDto {
  owner: string;
}

export interface ITaskGroupUpdatePayload {
  taskGroupUpdateDto: TaskGroupUpdateDto;
  taskGroupId: string;
}
