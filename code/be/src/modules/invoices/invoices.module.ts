import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/modules/invoices/entities';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoicesRepository } from './invoices.repository';
import { InvoiceDetailsRepository } from '../invoice-details/invoice-details.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesRepository, InvoiceDetailsRepository],
  exports: [InvoicesService],
})
export class InvoicesModule {}
