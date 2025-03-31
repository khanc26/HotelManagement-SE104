import { Module } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { BookingDetailsController } from './booking-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetail } from 'src/modules/booking-details/entities';
import { BookingDetailsRepository } from './booking-details.repository';
import { UsersRepository } from '../users/users.repository';
import { BookingsRepository } from '../bookings/bookings.repository';
import { RoomsRepository } from '../rooms/rooms.repository';
import { InvoiceDetailsRepository } from '../invoice-details/invoice-details.repository';
import { InvoicesRepository } from '../invoices/invoices.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BookingDetail])],
  controllers: [BookingDetailsController],
  providers: [
    BookingDetailsService,
    BookingDetailsRepository,
    UsersRepository,
    BookingsRepository,
    RoomsRepository,
    InvoiceDetailsRepository,
    InvoicesRepository,
  ],
  exports: [BookingDetailsService],
})
export class BookingDetailsModule {}
