import { User } from 'src/modules/users/entities/user.entity';
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
import { transformDateTime } from 'src/libs/common/helpers';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
    unique: true,
  })
  roleName!: RoleEnum;

  @Column({ nullable: true })
  readonly description?: string;

  @OneToMany(() => User, (user) => user.role, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  users!: User[];

  @CreateDateColumn({ type: 'timestamp', transformer: transformDateTime })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', transformer: transformDateTime })
  readonly updatedAt!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    transformer: transformDateTime,
  })
  readonly deletedAt?: Date;
}
