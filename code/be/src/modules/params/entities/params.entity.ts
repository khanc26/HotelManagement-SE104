import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { transformDateTime } from '../../../libs/common/helpers';

@Entity('params')
export class Param {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  paramName!: string;

  @Column({ type: 'float' })
  paramValue!: number;

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn({
    type: 'timestamp',
    transformer: transformDateTime,
  })
  readonly createdAt!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    transformer: transformDateTime,
  })
  readonly deletedAt?: Date;
}
