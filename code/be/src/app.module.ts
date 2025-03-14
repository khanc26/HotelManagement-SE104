import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import { SessionMiddleware } from 'src/libs/common/middlewares';
import { RedisProvider } from 'src/libs/common/providers';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RoomTypesModule } from './room-types/room-types.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        port: configService.get<number>('database.port'),
        host: configService.get<string>('database.host'),
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/config/migrations/*.js'],
        synchronize: false,
        logging: false,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    UsersModule,
    AuthModule,
    RoomsModule,
    RoomTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SessionMiddleware, RedisProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .exclude('/auth/sign-in', '/auth/sign-up', '/auth/sign-out')
      .forRoutes('*');
  }
}
