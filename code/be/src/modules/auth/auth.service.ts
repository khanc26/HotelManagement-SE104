import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SESSION_MAX_AGE } from 'src/libs/common/constants';
import { HashingProvider } from 'src/libs/common/providers';
import { JwtPayload } from 'src/libs/common/types';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingProvider: HashingProvider,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    return this.usersService.createUser(signUpDto);
  }

  async signIn(signInDto: SignInDto, request: Request) {
    const user = await this.usersService.handleGetProfileWithPassword(
      signInDto.email,
    );

    if (!user) {
      throw new UnauthorizedException('This email is not registered');
    }

    const isPasswordMatching = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('The password you entered is incorrect.');
    }

    const { accessToken, refreshToken } = this.handleGenerateTokens(
      user.id,
      user.role.roleName,
    );

    request.session.user = {
      userId: user.id,
      role: user.role.roleName,
      refresh_token: refreshToken,
      email: user.email,
      expired_at: new Date(Date.now() + SESSION_MAX_AGE),
    };

    return {
      accessToken,
      role: user.role.roleName,
    };
  }

  public handleGenerateTokens = (userId: string, role: string) => {
    const accessToken = this.jwtService.sign({ userId, role });

    const refreshToken = this.jwtService.sign(
      { userId, role },
      {
        expiresIn: this.configService.get('refresh_token_life', '600s'),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  };

  public handleRefreshToken = (refreshToken: string) => {
    if (!refreshToken)
      throw new UnauthorizedException(
        'Refresh token is missing from the request.',
      );

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt_secret_key', ''),
      });
    } catch (error) {
      console.error(error);

      throw new UnauthorizedException(
        'Your refresh token is invalid or has expired. Please log in again.',
      );
    }

    if (
      !payload ||
      typeof payload !== 'object' ||
      !payload.userId ||
      !payload.role
    )
      throw new UnauthorizedException('Invalid refresh token structure.');

    return {
      access_token: this.jwtService.sign({
        userId: payload.userId,
        role: payload.role,
      }),
    };
  };
}
