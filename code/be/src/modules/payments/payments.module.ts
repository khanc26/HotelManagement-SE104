import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/modules/invoices/entities';
import { InvoicesModule } from 'src/modules/invoices/invoices.module';
import { InvoicesRepository } from 'src/modules/invoices/invoices.repository';
import { InvoicesService } from 'src/modules/invoices/invoices.service';
import { Payment } from 'src/modules/payments/entities';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Payment]), InvoicesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, InvoicesRepository, InvoicesService],
})
export class PaymentsModule {}
