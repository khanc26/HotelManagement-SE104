import { User } from 'src/users/entities/user.entity';
import { ProfileStatus } from 'src/users/enums/profile-status.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  full_name!: string;

  @Column()
  nationality!: string;

  @Column({ type: 'enum', enum: ProfileStatus, default: ProfileStatus.ACTIVE })
  status!: ProfileStatus;

  @Column({ type: 'timestamp' })
  dob!: Date;

  @Column()
  phone_number!: string;

  @Column()
  address!: string;

  @Column()
  identity_number!: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ type: 'timestamp' })
  readonly created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deleted_at?: Date;
}
