import { Profile } from 'src/users/entities/profile.entity';
import { Role } from 'src/users/entities/role.entity';
import { UserType } from 'src/users/entities/user-type.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
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
  @JoinColumn()
  role!: Role;

  @ManyToOne(() => UserType, (userType) => userType.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  userType!: UserType;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt?: Date;
}
