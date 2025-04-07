import { BookingDetail } from 'src/modules/booking-details/entities';
import { User } from 'src/modules/users/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  totalPrice!: number;

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.booking, {
    orphanedRowAction: 'delete',
    cascade: true,
  })
  bookingDetails!: BookingDetail[];

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt?: Date;
}
