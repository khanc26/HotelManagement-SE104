import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SESSION_MAX_AGE } from 'src/libs/common/constants';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserSession } from 'src/libs/common/decorators';
import { TUserSession } from 'src/libs/common/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Req() request: Request) {
    const response = await this.authService.signIn(signInDto);

    const { data } = response;

    request.session.user = {
      userId: data.user.id,
      role: data.user.role,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      email: data.user.email,
      expired_at: new Date(Date.now() + SESSION_MAX_AGE),
    };

    return response;
  }

  @Post('refresh-token')
  refreshAccessToken(@UserSession() userSession: TUserSession) {
    return this.authService.handleRefreshToken(userSession);
  }
}
