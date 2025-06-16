import { transformDateTime } from '../../../libs/common/helpers';
import { Invoice } from '../../invoices/entities';
import { Room } from '../../rooms/entities';
import { User } from '../../users/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Booking {
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
  totalPrice!: number;

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'booker_id',
  })
  user!: User;

  @ManyToMany(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'booking_participant',
    joinColumn: {
      name: 'booking_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  participants!: User[];

  @ManyToOne(() => Room, (room) => room.bookings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  room!: Room;

  @OneToOne(() => Invoice, (invoice) => invoice.booking)
  invoice!: Invoice;

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

  @Column({
    type: 'timestamp',
    nullable: true,
    transformer: transformDateTime,
  })
  checkInDate?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    transformer: transformDateTime,
  })
  checkOutDate?: Date;
}
