import { Booking } from 'src/modules/bookings/entities';
import { InvoicesStatus } from 'src/modules/invoices/enums/invoices-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  base_price!: number;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  total_price!: number;

  @Column({ type: 'int' })
  day_rent!: number;

  @Column({
    type: 'enum',
    enum: InvoicesStatus,
    default: InvoicesStatus.UNPAID,
  })
  status!: InvoicesStatus;

  @OneToOne(() => Booking, (booking) => booking.invoice, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  booking!: Booking;

  @CreateDateColumn({ type: 'timestamp' })
  readonly created_at!: Date;
}
