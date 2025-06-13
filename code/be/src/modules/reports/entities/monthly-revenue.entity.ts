import { transformDateTime } from 'src/libs/common/helpers';
import { MonthlyRevenueDetail } from 'src/modules/reports/entities/monthly-revenue-detail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class MonthlyRevenue {
  @PrimaryColumn()
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

  @OneToMany(() => MonthlyRevenueDetail, (detail) => detail.monthlyRevenue)
  details!: MonthlyRevenueDetail[];

  @CreateDateColumn({
    type: 'timestamp',
    transformer: transformDateTime,
  })
  createdAt!: Date;
}
