import { transformDateTime } from 'src/libs/common/helpers';
import { Booking } from 'src/modules/bookings/entities';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { Role } from 'src/modules/users/entities/role.entity';
import { UserType } from 'src/modules/users/entities/user-type.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  @ManyToMany(() => Booking, (booking) => booking.user, {
    orphanedRowAction: 'delete',
    cascade: true,
  })
  bookings!: Booking[];

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
