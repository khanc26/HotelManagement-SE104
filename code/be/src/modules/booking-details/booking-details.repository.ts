import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BookingDetail } from './entities';

@Injectable()
export class BookingDetailsRepository extends Repository<BookingDetail> {
  constructor(private dataSource: DataSource) {
    super(BookingDetail, dataSource.createEntityManager());
  }
}
