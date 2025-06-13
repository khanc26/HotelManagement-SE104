import { transformDateTime } from 'src/libs/common/helpers';
import { Booking } from 'src/modules/bookings/entities';
import { InvoicesStatus } from 'src/modules/invoices/enums/invoices-status.enum';
import { Payment } from 'src/modules/payments/entities';
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

  @Column({
    type: 'decimal',
    scale: 2,
    precision: 10,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  basePrice!: number;

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

  @Column({ type: 'int' })
  dayRent!: number;

  @Column({
    type: 'enum',
    enum: InvoicesStatus,
    default: InvoicesStatus.UNPAID,
  })
  status!: InvoicesStatus;

  @OneToOne(() => Booking, (booking) => booking.invoice, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  booking!: Booking;

  @OneToOne(() => Payment, (payment) => payment.invoice, { nullable: true })
  payment?: Payment;

  @CreateDateColumn({
    type: 'timestamp',
    transformer: transformDateTime,
  })
  readonly createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    transformer: transformDateTime,
  })
  readonly updatedAt!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    transformer: transformDateTime,
  })
  readonly deletedAt?: Date;
}
