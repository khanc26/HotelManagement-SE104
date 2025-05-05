import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetailsRepository } from 'src/modules/booking-details/booking-details.repository';
import { BookingDetailsService } from 'src/modules/booking-details/booking-details.service';
import { BookingDetail } from 'src/modules/booking-details/entities';
import { BookingsModule } from 'src/modules/bookings/bookings.module';
import { Invoice } from 'src/modules/invoices/entities';
import { InvoicesModule } from 'src/modules/invoices/invoices.module';
import { MonthlyRevenue } from 'src/modules/reports/entities';
import { Room } from 'src/modules/rooms/entities';
import { User } from 'src/modules/users/entities';
import { UsersModule } from 'src/modules/users/users.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { Param } from '../params/entities';
import { ParamsModule } from '../params/params.module';

@Module({
  imports: [
    BookingsModule,
    TypeOrmModule.forFeature([
      MonthlyRevenue,
      BookingDetail,
      User,
      Invoice,
      Param,
      Room,
    ]),
    UsersModule,
    InvoicesModule,
    ParamsModule,
    RoomsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, BookingDetailsService, BookingDetailsRepository],
  exports: [ReportsService],
})
export class ReportsModule {}
