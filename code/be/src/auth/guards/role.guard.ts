import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/libs/common/decorators';
import { JwtPayload } from 'src/libs/common/types';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<Request>();

    if (!user) throw new UnauthorizedException('User Not Authenticated.');

    const hasRole = requiredRoles.includes((user as JwtPayload).role);

    if (!hasRole)
      throw new ForbiddenException(
        "You don't have permission to access this route.",
      );

    return true;
  }
}
