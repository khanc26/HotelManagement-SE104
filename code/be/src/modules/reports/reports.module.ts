import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from 'src/modules/bookings/bookings.module';
import { Invoice } from 'src/modules/invoices/entities';
import { InvoicesModule } from 'src/modules/invoices/invoices.module';
import { MonthlyRevenue } from 'src/modules/reports/entities';
import { Room } from 'src/modules/rooms/entities';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { User } from 'src/modules/users/entities';
import { UsersModule } from 'src/modules/users/users.module';
import { Param } from '../params/entities';
import { ParamsModule } from '../params/params.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    BookingsModule,
    TypeOrmModule.forFeature([MonthlyRevenue, User, Invoice, Param, Room]),
    UsersModule,
    InvoicesModule,
    ParamsModule,
    RoomsModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
