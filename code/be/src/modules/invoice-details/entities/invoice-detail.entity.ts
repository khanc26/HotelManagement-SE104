import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingDetail } from '../../booking-details/entities';
import { Invoice } from '../../invoices/entities';
import { InvoicesStatus } from '../../invoices/enums';

@Entity()
export class InvoiceDetail {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  basePrice!: number;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  totalPrice!: number;

  @Column({
    type: 'enum',
    enum: InvoicesStatus,
    default: InvoicesStatus.UNPAID,
  })
  status!: InvoicesStatus;

  @Column()
  dayRent!: number;

  @OneToOne(
    () => BookingDetail,
    (bookingDetail) => bookingDetail.invoiceDetail,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn()
  bookingDetail!: BookingDetail;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceDetails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  invoice!: Invoice;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt?: Date;
}
