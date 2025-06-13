import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from 'src/modules/reports/reports.service';
import { Invoice } from './entities';
import { InvoicesController } from './invoices.controller';
import { InvoicesRepository } from './invoices.repository';
import { InvoicesService } from './invoices.service';
import { MonthlyRevenue } from 'src/modules/reports/entities';
import { MonthlyRevenueDetail } from 'src/modules/reports/entities/monthly-revenue-detail.entity';
import { RoomTypesModule } from 'src/modules/room-types/room-types.module';
import { RoomType } from 'src/modules/room-types/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      MonthlyRevenue,
      MonthlyRevenueDetail,
      RoomType,
    ]),
    RoomTypesModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesRepository, ReportsService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
