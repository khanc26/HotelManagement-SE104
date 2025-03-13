import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IUserSession } from 'src/libs/common/types';

export const UserSession = createParamDecorator(
  (data: keyof IUserSession['user'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.user as IUserSession['user'];

    if (data && data in user) {
      return user[data] ?? null;
    }

    return user;
  },
);
