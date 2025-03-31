import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/modules/bookings/entities';
import { BookingsRepository } from './bookings.repository';
import { InvoicesRepository } from '../invoices/invoices.repository';
import { InvoiceDetailsRepository } from '../invoice-details/invoice-details.repository';
import { BookingDetailsRepository } from '../booking-details/booking-details.repository';
import { UsersRepository } from '../users/users.repository';
import { RoomsRepository } from '../rooms/rooms.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    BookingsRepository,
    InvoicesRepository,
    InvoiceDetailsRepository,
    BookingDetailsRepository,
    UsersRepository,
    RoomsRepository,
  ],
})
export class BookingsModule {}
