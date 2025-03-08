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
import { JwtAuthGuard, RoleAuthGuard } from 'src/auth/guards';
import { Roles, UserSession } from 'src/libs/common/decorators';
import { TUserSession } from 'src/libs/common/types';
import { RoleEnum as Role } from 'src/users/enums/role.enum';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

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
    const { accessToken, refreshToken } = await this.authService.signIn(
      signInDto,
      request,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
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
