export interface IUserSession {
  cookie: {
    originalMaxAge: number;
    expires: string;
    secure: boolean;
    httpOnly: boolean;
    path: string;
    sameSite: 'lax' | 'strict' | 'none';
  };
  user: {
    userId: string;
    role: string;
    refresh_token: string;
    email: string;
    expired_at: string;
  };
}
