import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoomType } from '../../room-types/entities/room-type.entity';
import { RoomStatusEnum } from '../enums/room-status.enum';

@Entity({ name: 'room' })
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

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt?: Date;
}
