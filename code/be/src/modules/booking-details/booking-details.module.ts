import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetail } from 'src/modules/booking-details/entities';
import { BookingDetailsController } from './booking-details.controller';
import { BookingDetailsService } from './booking-details.service';
import { BookingDetailsRepository } from 'src/modules/booking-details/booking-details.repository';
import { UsersModule } from 'src/modules/users/users.module';
import { UsersService } from 'src/modules/users/users.service';
import { Profile, Role, User, UserType } from 'src/modules/users/entities';
import { InvoicesModule } from 'src/modules/invoices/invoices.module';
import { InvoicesService } from 'src/modules/invoices/invoices.service';
import { ConfigurationsService } from 'src/modules/configurations/configurations.service';
import { RoomsService } from 'src/modules/rooms/rooms.service';
import { Room } from 'src/modules/rooms/entities';
import { Configuration } from 'src/modules/configurations/entities';
import { UsersRepository } from 'src/modules/users/users.repository';
import { BcryptProvider, HashingProvider } from 'src/libs/common/providers';
import { Invoice } from 'src/modules/invoices/entities';
import { RoomType } from 'src/modules/room-types/entities';
import { RoomTypesService } from 'src/modules/room-types/room-types.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BookingDetail,
      User,
      Room,
      Configuration,
      Profile,
      UserType,
      Role,
      Invoice,
      RoomType,
    ]),
    UsersModule,
    InvoicesModule,
  ],
  controllers: [BookingDetailsController],
  providers: [
    BookingDetailsService,
    BookingDetailsRepository,
    UsersService,
    InvoicesService,
    ConfigurationsService,
    RoomsService,
    UsersRepository,
    RoomTypesService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  exports: [BookingDetailsService],
})
export class BookingDetailsModule {}
