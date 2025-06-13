import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from 'src/modules/bookings/bookings.module';
import { BookingsService } from 'src/modules/bookings/bookings.service';
import { Booking } from 'src/modules/bookings/entities';
import { Invoice } from 'src/modules/invoices/entities';
import { InvoicesModule } from 'src/modules/invoices/invoices.module';
import { InvoicesRepository } from 'src/modules/invoices/invoices.repository';
import { InvoicesService } from 'src/modules/invoices/invoices.service';
import { Payment } from 'src/modules/payments/entities';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BookingsRepository } from 'src/modules/bookings/bookings.repository';
import { UsersModule } from 'src/modules/users/users.module';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { ParamsModule } from 'src/modules/params/params.module';
import { ReportsModule } from 'src/modules/reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Payment, Booking, BookingsRepository]),
    InvoicesModule,
    BookingsModule,
    UsersModule,
    RoomsModule,
    ParamsModule,
    ReportsModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    InvoicesRepository,
    InvoicesService,
    BookingsService,
  ],
})
export class PaymentsModule {}
