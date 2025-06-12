import { MonthlyRevenue } from 'src/modules/reports/entities/monthly-revenue.entity';
import { RoomType } from 'src/modules/room-types/entities';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class MonthlyRevenueDetail {
  @PrimaryColumn()
  month!: string;

  @PrimaryColumn({ name: 'room_type_id' })
  roomTypeId!: string;

  @ManyToOne(() => MonthlyRevenue, (monthly) => monthly.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'month' })
  monthlyRevenue!: MonthlyRevenue;

  @ManyToOne(() => RoomType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_type_id' })
  roomType!: RoomType;

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
  revenue!: number;
}
