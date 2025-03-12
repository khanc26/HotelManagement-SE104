import 'express-session';
import 'express';
import { User } from 'src/users/entities/user.entity';

// augment the express-session module to include the user property in the session data
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

// augment the express module to include the user property in the request object
declare module 'express' {
  interface Request {
    user?: User;
  }
}
