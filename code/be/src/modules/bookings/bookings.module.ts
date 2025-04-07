import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetailsRepository } from 'src/modules/booking-details/booking-details.repository';
import { BookingDetailsService } from 'src/modules/booking-details/booking-details.service';
import { Booking } from 'src/modules/bookings/entities';
import { ConfigurationsService } from 'src/modules/configurations/configurations.service';
import { Configuration } from 'src/modules/configurations/entities';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Profile,
      UserType,
      Role,
      Invoice,
      Configuration,
      Room,
      RoomType,
    ]),
    UsersModule,
  ],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    BookingsRepository,
    BookingDetailsService,
    BookingDetailsRepository,
    InvoicesService,
    ConfigurationsService,
    RoomsService,
    InvoicesRepository,
    RoomTypesService,
  ],
})
export class BookingsModule {}
