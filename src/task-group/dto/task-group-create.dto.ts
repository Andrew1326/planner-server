import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class TaskGroupCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  board: string;
}
