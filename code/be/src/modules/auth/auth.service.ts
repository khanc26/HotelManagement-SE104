import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  DEFAULT_TTL_OTP_EXPIRED,
  EmailTemplateNameEnum,
  SESSION_MAX_AGE,
  VerifiedOtpPayload,
} from 'src/libs/common/constants';
import { HashingProvider, RedisProvider } from 'src/libs/common/providers';
import { JwtPayload } from 'src/libs/common/types';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import {
  ForgetPasswordDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from 'src/modules/auth/dto';
import { EmailsProducer } from 'src/modules/emails/producers';
import { generateOtp } from 'src/libs/common/helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingProvider: HashingProvider,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailsProducer: EmailsProducer,
    private readonly redisProvider: RedisProvider,
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

  public forgetPassword = async (forgetPasswordDto: ForgetPasswordDto) => {
    const { email } = forgetPasswordDto;

    const user = await this.usersService.handleGetUserByField('email', email);

    if (!user) throw new NotFoundException('This email is not registered.');

    const otp = generateOtp();

    await this.redisProvider.set(
      `${email}:otp:reset-password`,
      otp,
      DEFAULT_TTL_OTP_EXPIRED,
    );

    await this.emailsProducer.handleSendEmail(
      email,
      EmailTemplateNameEnum.EMAIL_FORGET_PASSWORD,
      {
        full_name: user.profile.fullName,
        otp_code: otp,
      },
    );

    return {
      success: true,
      message: 'An OTP has been sent to your email. Please check your inbox.',
    };
  };

  public verifyOtp = async (verifyOtpDto: VerifyOtpDto) => {
    const { otp, email } = verifyOtpDto;

    const user = await this.usersService.handleGetUserByField('email', email);

    if (!user) throw new NotFoundException('This email is not registered.');

    const cachedOtp = await this.redisProvider.get(
      `${email}:otp:reset-password`,
    );

    if (!cachedOtp || cachedOtp.trim() === '')
      throw new UnauthorizedException(
        'Your OTP has expired. Please go back and restart the forgot password process.',
      );

    if (otp !== JSON.parse(cachedOtp))
      throw new BadRequestException(
        `The OTP you entered is incorrect. Please try again.`,
      );

    await this.redisProvider.delete(`${email}:otp:reset-password`);

    const payload: VerifiedOtpPayload = {
      email,
      otp,
      is_verified: true,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '30m',
    });

    return {
      token,
    };
  };

  public resetPassword = async (resetPasswordDto: ResetPasswordDto) => {
    const { token, email, newPassword } = resetPasswordDto;

    const user = await this.usersService.handleGetUserByField('email', email);

    if (!user) throw new NotFoundException('This email is not registered.');

    try {
      const { is_verified } = this.jwtService.verify<VerifiedOtpPayload>(token);

      if (!is_verified)
        throw new UnauthorizedException('Your token is invalid or expired.');

      await this.usersService.updatePassword(email, newPassword);

      return {
        success: true,
        message: `Your password has been successfully updated.`,
      };
    } catch (error) {
      console.error(error);

      throw new UnauthorizedException('Your token is invalid or expired.');
    }
  };
}
