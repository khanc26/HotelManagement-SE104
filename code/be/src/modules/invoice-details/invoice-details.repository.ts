import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InvoiceDetail } from './entities/invoice-detail.entity';

@Injectable()
export class InvoiceDetailsRepository extends Repository<InvoiceDetail> {
  constructor(private dataSource: DataSource) {
    super(InvoiceDetail, dataSource.createEntityManager());
  }
}
