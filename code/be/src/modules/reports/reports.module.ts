import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetailsService } from 'src/modules/booking-details/booking-details.service';
import { BookingDetail } from 'src/modules/booking-details/entities';
import { BookingsModule } from 'src/modules/bookings/bookings.module';
import { MonthlyRevenue } from 'src/modules/reports/entities';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { BookingDetailsRepository } from 'src/modules/booking-details/booking-details.repository';
import { UsersModule } from 'src/modules/users/users.module';
import { InvoicesModule } from 'src/modules/invoices/invoices.module';
import { User } from 'src/modules/users/entities';
import { Invoice } from 'src/modules/invoices/entities';
import { ConfigurationsModule } from 'src/modules/configurations/configurations.module';
import { Configuration } from 'src/modules/configurations/entities';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { Room } from 'src/modules/rooms/entities';

@Module({
  imports: [
    BookingsModule,
    TypeOrmModule.forFeature([
      MonthlyRevenue,
      BookingDetail,
      User,
      Invoice,
      Configuration,
      Room,
    ]),
    UsersModule,
    InvoicesModule,
    ConfigurationsModule,
    RoomsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, BookingDetailsService, BookingDetailsRepository],
  exports: [ReportsService],
})
export class ReportsModule {}
