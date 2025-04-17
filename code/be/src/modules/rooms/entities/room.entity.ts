import { transformDateTime } from 'src/libs/common/helpers';
import { BookingDetail } from 'src/modules/booking-details/entities/booking-detail.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomType } from '../../room-types/entities/room-type.entity';
import { RoomStatusEnum } from '../enums/room-status.enum';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ unique: true })
  roomNumber!: string;

  @Column({ nullable: true, type: 'text' })
  note?: string;

  @Column({
    type: 'enum',
    enum: RoomStatusEnum,
    default: RoomStatusEnum.AVAILABLE,
  })
  status!: RoomStatusEnum;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roomType!: RoomType;

  @OneToMany(() => BookingDetail, (bookingDetail) => bookingDetail.room, {
    orphanedRowAction: 'delete',
    cascade: true,
  })
  bookingDetails!: BookingDetail[];

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
