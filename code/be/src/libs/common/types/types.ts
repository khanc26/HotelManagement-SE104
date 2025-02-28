import 'express-session';
import 'express';
import { User } from 'src/users/entities/user.entity';

export type JwtPayload = {
  userId: string;
  role: string;
  iat: number;
};

export type TUserSession = {
  userId: string;
  role: string;
  access_token: string;
  refresh_token: string;
  email: string;
};

declare module 'express-session' {
  interface SessionData {
    user?: {
      userId: string;
      role: string;
      access_token: string;
      refresh_token: string;
      email: string;
      expired_at: Date;
    };
  }
}

declare module 'express' {
  interface Request {
    user?: User;
  }
}
