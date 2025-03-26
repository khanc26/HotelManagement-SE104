import { Module } from '@nestjs/common';
import { BookingDetailsService } from './booking-details.service';
import { BookingDetailsController } from './booking-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingDetails } from 'src/modules/booking-details/entities';

@Module({
  imports: [TypeOrmModule.forFeature([BookingDetails])],
  controllers: [BookingDetailsController],
  providers: [BookingDetailsService],
})
export class BookingDetailsModule {}
