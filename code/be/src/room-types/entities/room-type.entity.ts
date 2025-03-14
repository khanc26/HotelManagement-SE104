import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';
import { RoomTypeName } from 'src/room-types/enums/room-type-name.enum';

@Entity({ name: 'room_type' })
export class RoomType {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'enum', enum: RoomTypeName })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  roomPrice!: number;

  @OneToMany(() => Room, (room) => room.roomType, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  rooms!: Room[];

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt?: Date;
}
