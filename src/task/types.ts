import { TaskUpdateDto } from "./dto/task-update.dto";

export interface ITaskUpdatePayload {
  taskUpdateDto: TaskUpdateDto;
  taskId: string;
}
