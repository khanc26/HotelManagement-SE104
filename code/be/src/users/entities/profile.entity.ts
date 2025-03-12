import { User } from 'src/users/entities/user.entity';
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
import { ProfileStatusEnum } from '../enums/profile-status.enum';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  fullName!: string;

  @Column()
  nationality!: string;

  @Column({
    type: 'enum',
    enum: ProfileStatusEnum,
    default: ProfileStatusEnum.ACTIVE,
  })
  status!: ProfileStatusEnum;

  @Column({ type: 'timestamp' })
  dob!: Date;

  @Column()
  phoneNumber!: string;

  @Column()
  address!: string;

  @Column()
  identityNumber!: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user!: User;

  @CreateDateColumn({ type: 'timestamp' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  readonly deletedAt?: Date;
}
