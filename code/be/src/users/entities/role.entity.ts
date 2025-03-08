import { User } from 'src/users/entities/user.entity';
import { RoleEnum } from 'src/users/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role_name!: RoleEnum;

  @Column({ nullable: true })
  readonly description?: string;

  @OneToMany(() => User, (user) => user.role, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  users!: User[];

  @CreateDateColumn({ type: 'timestamp' })
  readonly created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at!: Date;
}
