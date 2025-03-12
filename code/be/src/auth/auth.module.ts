import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  BcryptProvider,
  HashingProvider,
  JwtProvider,
} from 'src/libs/common/providers';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret_key'),
        signOptions: {
          expiresIn: configService.get('access_token_life') ?? '120s',
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      session: true,
    }),
  ],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    UsersRepository,
    JwtProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
