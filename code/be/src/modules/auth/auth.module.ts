import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  BcryptProvider,
  HashingProvider,
  JwtProvider,
  RedisProvider,
} from 'src/libs/common/providers';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailsModule } from 'src/modules/emails/emails.module';
import { EmailsProducer } from 'src/modules/emails/producers';

@Module({
  imports: [
    UsersModule,
    EmailsModule,
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
    EmailsProducer,
    RedisProvider,
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
