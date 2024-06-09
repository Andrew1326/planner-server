import {
  IsEmail,
  IsNotEmpty,
  IsArray,
  IsOptional
} from "class-validator";
import { Role } from '../role/role.enum';

export class UserCreateDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsOptional()
  roles: Role[];
}
