import { Role } from '../role/role.enum';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: Role[];
}
