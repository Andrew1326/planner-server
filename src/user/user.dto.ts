import {
  IsEmail,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { Role } from '../role/role.enum';

export class UserCreateDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsArray()
  @IsOptional()
  roles: Role[];
}
