import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export const UserSession = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.session?.user;

    if (!user) return data ? '' : {};

    if (data && data in user) {
      return (user[data] as string) ?? '';
    }

    return user;
  },
);
