import { TaskUpdateDto } from './dto/task-update.dto';
import { User } from '../user/entities/user.entity';
import { Task } from './entities/task.entity';

export interface ITaskUpdatePayload {
  taskUpdateDto: TaskUpdateDto;
  taskId: string;
}

export interface ISafeTask extends Omit<Task, 'owner'> {
  owner: Omit<User, 'password'>;
}
