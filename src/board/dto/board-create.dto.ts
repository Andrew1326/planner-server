import { IsNotEmpty, IsString } from 'class-validator';

export class BoardCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  project: string;
}
