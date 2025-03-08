import { User } from 'src/users/entities/user.entity';
import { UserTypeEnum } from 'src/users/enums/user-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_type' })
export class UserType {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ type: 'enum', enum: UserTypeEnum })
  type_name!: UserTypeEnum;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => User, (user) => user.user_type, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  users!: User[];

  @CreateDateColumn({ type: 'timestamp' })
  readonly created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at!: Date;
}
