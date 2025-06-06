import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/modules/bookings/entities';
import { Invoice } from 'src/modules/invoices/entities';
import { InvoicesRepository } from 'src/modules/invoices/invoices.repository';
import { InvoicesService } from 'src/modules/invoices/invoices.service';
import { RoomType } from 'src/modules/room-types/entities';
import { RoomTypesService } from 'src/modules/room-types/room-types.service';
import { Room } from 'src/modules/rooms/entities';
import { RoomsService } from 'src/modules/rooms/rooms.service';
import { Profile, Role, UserType } from 'src/modules/users/entities';
import { UsersModule } from 'src/modules/users/users.module';
import { BookingsController } from './bookings.controller';
import { BookingsRepository } from './bookings.repository';
import { BookingsService } from './bookings.service';
import { ReportsService } from 'src/modules/reports/reports.service';
import { MonthlyRevenue } from 'src/modules/reports/entities';
import { Param } from '../params/entities';
import { ParamsService } from '../params/params.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Profile,
      UserType,
      Role,
      Invoice,
      Param,
      Room,
      RoomType,
      MonthlyRevenue,
    ]),
    UsersModule,
  ],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    BookingsRepository,
    InvoicesService,
    ParamsService,
    RoomsService,
    InvoicesRepository,
    RoomTypesService,
    ReportsService,
  ],
})
export class BookingsModule {}
