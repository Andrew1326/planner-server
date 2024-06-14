import { TaskGroupCreateDto } from './dto/task-group-create.dto';
import { TaskGroupUpdateDto } from './dto/task-group-update.dto';
import { User } from '../user/entities/user.entity';
import { TaskGroup } from './entities/task-group.entity';

export interface ITaskGroupCreatePayload extends TaskGroupCreateDto {
  owner: string;
}

export interface ITaskGroupUpdatePayload {
  taskGroupUpdateDto: TaskGroupUpdateDto;
  taskGroupId: string;
}

export interface ISafeTaskGroup extends Omit<TaskGroup, 'owner'> {
  owner: Omit<User, 'password'>;
}
