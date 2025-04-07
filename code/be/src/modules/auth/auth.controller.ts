import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Roles, UserSession } from 'src/libs/common/decorators';
import { JwtAuthGuard, RoleAuthGuard } from 'src/libs/common/guards';
import { JwtPayload } from 'src/libs/common/types';
import { SignInDto, SignUpDto } from 'src/modules/auth/dto';
import { RoleEnum as Role } from 'src/modules/users/enums/role.enum';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from './auth.service';

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
  async signIn(
    @Body() signInDto: SignInDto,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const { accessToken, role } = await this.authService.signIn(
      signInDto,
      request,
    );

    res.status(HttpStatus.OK).json({ accessToken, role });
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-out')
  signOut(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: 'Failed to log out.' });

      res.clearCookie('user_session', { path: '/' });

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Signed out successfully.' });
    });
  }

  @Post('refresh-token')
  refreshAccessToken(@UserSession('refresh_token') refreshToken: string) {
    return this.authService.handleRefreshToken(refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleGetProfile(@Req() request: Request) {
    const { userId } = request.user as JwtPayload;

    return this.usersService.handleGetProfileByUserId(userId);
  }
}
