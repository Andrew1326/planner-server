import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class TaskCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  group: string;
}
