import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/role.enum';
import { UserType } from '../enums/user-type.enum';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  nationality: string;

  @Column({
    name: 'user_type',
    type: 'enum',
    enum: UserType,
    default: UserType.LOCAL,
  })
  userType: UserType;
}
