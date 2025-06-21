import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import {
  LoggerMiddleware,
  MaintenanceMiddleware,
  SessionMiddleware,
} from 'src/libs/common/middlewares';
import { RedisProvider } from 'src/libs/common/providers';
import { AuthModule } from 'src/modules/auth/auth.module';
import { BookingsModule } from 'src/modules/bookings/bookings.module';
import { InvoicesModule } from 'src/modules/invoices/invoices.module';
import { RoomTypesModule } from 'src/modules/room-types/room-types.module';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { UsersModule } from 'src/modules/users/users.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailsModule } from './modules/emails/emails.module';
import { ParamsModule } from './modules/params/params.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { Profile, Role, User, UserType } from 'src/modules/users/entities';
import { Booking } from 'src/modules/bookings/entities';
import { Param } from 'src/modules/params/entities';
import { Invoice } from 'src/modules/invoices/entities';
import { MonthlyRevenue } from 'src/modules/reports/entities';
import { MonthlyRevenueDetail } from 'src/modules/reports/entities/monthly-revenue-detail.entity';
import { Payment } from 'src/modules/payments/entities';
import { Room } from 'src/modules/rooms/entities';
import { RoomType } from 'src/modules/room-types/entities';

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
        entities: [
          User,
          Booking,
          Param,
          Invoice,
          MonthlyRevenue,
          MonthlyRevenueDetail,
          Payment,
          Profile,
          Role,
          Room,
          RoomType,
          UserType,
        ],
        synchronize: true,
        logging: false,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    UsersModule,
    AuthModule,
    RoomsModule,
    RoomTypesModule,
    InvoicesModule,
    BookingsModule,
    ParamsModule,
    ReportsModule,
    PaymentsModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SessionMiddleware, RedisProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MaintenanceMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer
      .apply(SessionMiddleware)
      .exclude(
        '/',
        '/auth/sign-in',
        '/auth/sign-up',
        '/payments/vnpay/ipn',
        '/auth/forget-password',
        '/auth/verify-otp',
        '/auth/reset-password',
      )
      .forRoutes('*');
  }
}
