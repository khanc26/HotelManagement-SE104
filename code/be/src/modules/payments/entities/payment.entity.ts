import { transformDateTime } from 'src/libs/common/helpers';
import { Invoice } from 'src/modules/invoices/entities';
import { PaymentMethodsEnum, PaymentStatus } from 'src/modules/payments/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodsEnum,
    default: PaymentMethodsEnum.CARD,
  })
  paymentMethod!: PaymentMethodsEnum;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  amount!: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  payment_status!: PaymentStatus;

  @CreateDateColumn({ type: 'timestamp', transformer: transformDateTime })
  readonly payment_date!: Date;

  @OneToOne(() => Invoice, (invoice) => invoice.payment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  invoice!: Invoice;
}
