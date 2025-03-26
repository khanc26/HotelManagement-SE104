import { BookingDetails } from 'src/modules/booking-details/entities';
import { BookingsStatus } from 'src/modules/bookings/enums';
import { Invoice } from 'src/modules/invoices/entities';
import { User } from 'src/modules/users/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  total_price!: number;

  @Column({
    type: 'enum',
    enum: BookingsStatus,
    default: BookingsStatus.PENDING,
  })
  status!: BookingsStatus;

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @OneToMany(() => BookingDetails, (bookingDetails) => bookingDetails.booking, {
    orphanedRowAction: 'delete',
    cascade: true,
  })
  bookingDetails!: BookingDetails[];

  @OneToOne(() => Invoice, (invoice) => invoice.booking, {
    orphanedRowAction: 'delete',
    cascade: true,
  })
  invoice!: Invoice;

  @CreateDateColumn({ type: 'timestamp' })
  readonly created_at!: Date;
}
