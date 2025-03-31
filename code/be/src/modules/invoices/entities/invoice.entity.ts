import { InvoicesStatus } from 'src/modules/invoices/enums/invoices-status.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceDetail } from '../../invoice-details/entities/invoice-detail.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  basePrice!: number;

  @Column({ type: 'decimal', scale: 2, precision: 10 })
  totalPrice!: number;

  @Column({
    type: 'enum',
    enum: InvoicesStatus,
    default: InvoicesStatus.UNPAID,
  })
  status!: InvoicesStatus;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.invoice, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  invoiceDetails!: InvoiceDetail[];

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt?: Date;
}
