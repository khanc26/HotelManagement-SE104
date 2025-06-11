import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from 'src/modules/bookings/bookings.module';
import { MonthlyRevenue } from 'src/modules/reports/entities';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MonthlyRevenueDetail } from 'src/modules/reports/entities/monthly-revenue-detail.entity';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { Room } from 'src/modules/rooms/entities';
import { RoomsService } from 'src/modules/rooms/rooms.service';
import { RoomTypesModule } from 'src/modules/room-types/room-types.module';
import { RoomType } from 'src/modules/room-types/entities';
import { RoomTypesService } from 'src/modules/room-types/room-types.service';

@Module({
  imports: [
    BookingsModule,
    TypeOrmModule.forFeature([
      MonthlyRevenue,
      MonthlyRevenueDetail,
      Room,
      RoomType,
    ]),
    RoomsModule,
    RoomTypesModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, RoomTypesService],
  exports: [ReportsService],
})
export class ReportsModule {}
