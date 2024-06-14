import { PartialType } from '@nestjs/mapped-types';
import { TaskGroupCreateDto } from './task-group-create.dto';

export class TaskGroupUpdateDto extends PartialType(TaskGroupCreateDto) {}
