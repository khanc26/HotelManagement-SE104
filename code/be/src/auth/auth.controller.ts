import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { SESSION_MAX_AGE } from 'src/libs/common/constants';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Roles, UserSession } from 'src/libs/common/decorators';
import { TUserSession } from 'src/libs/common/types';
import { JwtAuthGuard, RoleAuthGuard } from 'src/auth/guards';
import { Role } from 'src/users/enums/role.enum';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  }

  @Post('refresh-token')
  refreshAccessToken(@UserSession() userSession: TUserSession) {
    return this.authService.handleRefreshToken(userSession);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleGetProfile(@UserSession() userSession: TUserSession) {
    const { userId } = userSession;

    return this.usersService.handleGetProfileByUserId(userId);
  }
}
