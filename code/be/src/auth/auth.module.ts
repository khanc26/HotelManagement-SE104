import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategies';
import { BcryptProvider, HashingProvider } from 'src/libs/common/providers';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt_secret_key'),
        signOptions: {
          expiresIn: configService.get('access_token_life') ?? '120s',
        },
      }),
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
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
