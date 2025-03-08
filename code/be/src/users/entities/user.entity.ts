import { Profile } from 'src/users/entities/profile.entity';
import { Role } from 'src/users/entities/role.entity';
import { UserType } from 'src/users/entities/user-type.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile!: Profile;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @ManyToOne(() => UserType, (userType) => userType.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_type_id' })
  user_type!: UserType;

  @CreateDateColumn({ type: 'timestamp' })
  readonly created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at?: Date;
}
