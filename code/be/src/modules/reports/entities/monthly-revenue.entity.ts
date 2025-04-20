import { transformDateTime } from 'src/libs/common/helpers';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MonthlyRevenue {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ unique: true })
  month!: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  totalRevenue!: number;

  @CreateDateColumn({
    type: 'timestamp',
    transformer: transformDateTime,
  })
  createdAt!: Date;
}
