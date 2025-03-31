import { Booking } from 'src/modules/bookings/entities';
import { Room } from 'src/modules/rooms/entities/room.entity';
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
import { InvoiceDetail } from '../../invoice-details/entities/invoice-detail.entity';

@Entity()
export class BookingDetail {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'int' })
  guestCount!: number;

  @Column({ type: 'boolean', default: false })
  hasForeigners!: boolean;

  @Column({ type: 'timestamp' })
  startDate!: Date;

  @Column({ type: 'timestamp' })
  endDate!: Date;

  @ManyToOne(() => Booking, (booking) => booking.bookingDetails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  booking!: Booking;

  @ManyToOne(() => Room, (room) => room.bookingDetails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  room!: Room;

  @OneToOne(
    () => InvoiceDetail,
    (invoiceDetail) => invoiceDetail.bookingDetail,
    {
      cascade: true,
      orphanedRowAction: 'delete',
    },
  )
  invoiceDetail!: InvoiceDetail;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt?: Date;
}
