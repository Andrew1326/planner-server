import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BoardCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  project: string;
}
