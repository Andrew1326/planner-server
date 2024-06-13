import { User } from './user.entity';

export interface ISessionUser extends Pick<User, 'name' | 'email' | 'roles'> {
  iat: number;
  exp: number;
}
