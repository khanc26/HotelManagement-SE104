import { BookingDetail } from 'src/modules/booking-details/entities';
import { InvoicesStatus } from 'src/modules/invoices/enums/invoices-status.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  basePrice!: number;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  totalPrice!: number;

  @Column({ type: 'int' })
  dayRent!: number;

  @Column({
    type: 'enum',
    enum: InvoicesStatus,
    default: InvoicesStatus.UNPAID,
  })
  status!: InvoicesStatus;

  @OneToOne(() => BookingDetail, (bookingDetail) => bookingDetail.invoice, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  bookingDetail!: BookingDetail;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt?: Date;
}
