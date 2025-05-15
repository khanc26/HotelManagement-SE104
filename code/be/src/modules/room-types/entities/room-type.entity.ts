import { transformDateTime } from 'src/libs/common/helpers';
import { RoomTypeName } from 'src/modules/room-types/enums/room-type-name.enum';
import { Room } from 'src/modules/rooms/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RoomType {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'enum', enum: RoomTypeName, unique: true })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'decimal',
    scale: 2,
    precision: 10,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  roomPrice!: number;

  @OneToMany(() => Room, (room) => room.roomType, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  rooms!: Room[];

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
