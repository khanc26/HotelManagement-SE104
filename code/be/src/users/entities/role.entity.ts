import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEnum } from '../enums/role.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  roleName!: RoleEnum;

  @Column({ nullable: true })
  readonly description?: string;

  @OneToMany(() => User, (user) => user.role, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  users!: User[];

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt?: Date;
}
