import 'express';
import 'express-session';

// augment the express-session module to include the user property in the session data
declare module 'express-session' {
  interface SessionData {
    user?: {
      userId: string;
      role: string;
      refresh_token: string;
      email: string;
      expired_at: Date;
    };
  }
}
