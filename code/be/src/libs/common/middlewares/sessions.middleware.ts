import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RedisProvider } from 'src/libs/common/providers/redis.provider';
import { IUserSession } from 'src/libs/common/types';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly redisProvider: RedisProvider) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.signedCookies['user_session'] as string;

    if (!sessionId)
      throw new UnauthorizedException('A valid session is required.');

    const user = await this.redisProvider.get('sess:' + sessionId);

    if (user) {
      req.user = (JSON.parse(user) as IUserSession).user;
    }

    next();
  }
}
