import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { transformDateTime } from '../../../libs/common/helpers';

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  configName!: string;

  @Column({ type: 'float' })
  configValue!: number;

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
