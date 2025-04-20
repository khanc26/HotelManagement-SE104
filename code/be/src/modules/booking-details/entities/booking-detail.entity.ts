import { transformDateTime } from 'src/libs/common/helpers';
import {
  BookingDetailsApprovalStatus,
  BookingDetailsStatus,
} from 'src/modules/booking-details/enums';
import { Booking } from 'src/modules/bookings/entities';
import { Invoice } from 'src/modules/invoices/entities';
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

@Entity()
export class BookingDetail {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'int' })
  guestCount!: number;

  @Column({ type: 'boolean', default: false })
  hasForeigners!: boolean;

  @Column({ type: 'timestamp', transformer: transformDateTime })
  startDate!: Date;

  @Column({ type: 'timestamp', transformer: transformDateTime })
  endDate!: Date;

  @Column({
    type: 'enum',
    enum: BookingDetailsStatus,
    default: BookingDetailsStatus.PENDING,
  })
  status!: BookingDetailsStatus;

  @Column({
    type: 'enum',
    enum: BookingDetailsApprovalStatus,
    default: BookingDetailsApprovalStatus.PENDING,
  })
  approvalStatus!: BookingDetailsApprovalStatus;

  @Column({
    type: 'decimal',
    scale: 2,
    precision: 10,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  totalPrice!: number;

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

  @OneToOne(() => Invoice, (invoice) => invoice.bookingDetail)
  invoice!: Invoice;

  @CreateDateColumn({ type: 'timestamp', transformer: transformDateTime })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', transformer: transformDateTime })
  readonly updatedAt!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    transformer: transformDateTime,
  })
  readonly deletedAt?: Date;
}
