import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/libs/common/providers';
import { JwtPayload, TUserSession } from 'src/libs/common/types';
import { UsersRepository } from '../users/users.repository';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingProvider: HashingProvider,
    private readonly usersService: UsersService,
    @InjectRepository(UsersRepository)
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await this.hashingProvider.hashPassword(
      signUpDto.password,
    );

    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });

    return await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        role: true,
        nationality: true,
        userType: true,
      },
    });
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email: signInDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('This email is not registered');
    }

    const isPasswordMatching = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Password is incorrect');
    }

    const { accessToken, refreshToken } = this.handleGenerateTokens(
      user.id,
      user.role,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...res } = user;

    return {
      statusCode: 200,
      message: 'Sign in successfully.',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: res,
      },
    };
  }

  public handleGenerateTokens = (userId: string, role: string) => {
    const accessToken = this.jwtService.sign({ userId, role });

    const refreshToken = this.jwtService.sign(
      { userId, role },
      {
        expiresIn: this.configService.get('refresh_token_life') ?? '',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  };

  public handleRefreshToken = (userSession: TUserSession) => {
    const { refresh_token } = userSession;

    if (!refresh_token)
      throw new UnauthorizedException('Refresh token is missing.');

    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(refresh_token, {
        secret: this.configService.get<string>('jwt_secret_key') ?? '',
      });
    } catch (error) {
      console.error(error);

      throw new UnauthorizedException(
        'Refresh Token is invalid or has expired.',
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
