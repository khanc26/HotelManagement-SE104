import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities';
import { Invoice } from '../invoices/entities';
import { InvoicesRepository } from '../invoices/invoices.repository';
import { InvoicesService } from '../invoices/invoices.service';
import { RoomType } from '../room-types/entities';
import { RoomTypesService } from '../room-types/room-types.service';
import { Room } from '../rooms/entities';
import { RoomsService } from '../rooms/rooms.service';
import { Profile, Role, UserType } from '../users/entities';
import { UsersModule } from '../users/users.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { BookingsController } from './bookings.controller';
import { BookingsRepository } from './bookings.repository';
import { BookingsService } from './bookings.service';
import { ReportsService } from '../reports/reports.service';
import { MonthlyRevenue } from '../reports/entities';
import { Param } from '../params/entities';
import { ParamsService } from '../params/params.service';
import { RoomsModule } from '../rooms/rooms.module';
import { ParamsModule } from 'src/modules/params/params.module';

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
    InvoicesModule,
    RoomsModule,
    ParamsModule,
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
