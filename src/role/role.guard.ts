import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './role.decorator';
import { get, intersection } from 'lodash';
import { User } from '../user/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // continue if no roles required
    if (!requiredRoles) {
      return true;
    }

    // define req
    const req = context.switchToHttp().getRequest();

    // define user
    const user: User = get(req, 'user');

    // allow access only if user includes all mentioned roles
    const hasUserAccess: boolean =
      intersection(requiredRoles, user.roles).length === requiredRoles.length;

    return hasUserAccess;
  }
}
