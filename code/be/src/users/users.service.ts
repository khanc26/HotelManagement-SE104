import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { HashingProvider } from 'src/libs/common/providers';
import { Profile } from 'src/users/entities/profile.entity';
import { UserType } from 'src/users/entities/user-type.entity';
import { ProfileStatusEnum } from 'src/users/enums/profile-status.enum';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';
import { UsersRepository } from './users.repository';
import { Role } from 'src/users/entities/role.entity';
import { RoleEnum } from 'src/users/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly userRepository: UsersRepository,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly hashingProvider: HashingProvider,
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async createUser(signUpDto: SignUpDto) {
    const existingUserWithEmail = await this.userRepository.findOne({
      where: {
        email: signUpDto.email,
      },
    });

    if (existingUserWithEmail)
      throw new BadRequestException(
        `This email has already been used by another user.`,
      );

    const { password, email, userTypeName, ...res } = signUpDto;

    const userRole = await this.roleRepository.findOne({
      where: { roleName: RoleEnum.USER },
    });

    if (!userRole)
      throw new NotFoundException('Role user not found in database.');

    const existingUserType = await this.userTypeRepository.findOne({
      where: { typeName: userTypeName },
    });

    if (!existingUserType)
      throw new NotFoundException(
        `Type '${userTypeName}' not found in database.`,
      );

    const hashedPassword = await this.hashingProvider.hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    const newProfile = this.profileRepository.create(res);
    await this.profileRepository.save(newProfile);

    newUser.profile = newProfile;
    newUser.userType = existingUserType;
    newUser.role = userRole;

    await this.userRepository.save(newUser);

    return omit(
      await this.userRepository.findOne({
        where: { id: newUser.id },
        relations: ['role', 'profile', 'user_type'],
      }),
      [
        'password',
        'role.created_at',
        'role.updated_at',
        'role.id',
        'role.description',
        'profile.created_at',
        'profile.updated_at',
        'profile.deleted_at',
        'user_type.description',
        'user_type.created_at',
        'user_type.updated_at',
      ],
    );
  }

  async findAll() {
    return (
      await this.userRepository.find({
        relations: ['role', 'profile', 'user_type'],
      })
    ).map((user) =>
      omit(user, [
        'password',
        'role.created_at',
        'role.updated_at',
        'role.id',
        'role.description',
        'profile.created_at',
        'profile.updated_at',
        'profile.deleted_at',
        'user_type.description',
        'user_type.created_at',
        'user_type.updated_at',
      ]),
    );
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['role', 'profile', 'user_type'],
    });
  }

  public handleDeleteUser = async (userId: string) => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user)
      throw new NotFoundException(`User with id: '${userId}' not found.`);

    user.profile.status = ProfileStatusEnum.INACTIVE;

    await this.profileRepository.softDelete({ id: user.profile.id });

    await this.userRepository.save(user);

    return this.findAll();
  };

  public handleGetProfileByUserId = async (userId: string) => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'role'],
    });

    if (!user)
      throw new NotFoundException(`User with id: '${userId}' not found.`);

    return omit(user, [
      'password',
      'role.created_at',
      'role.updated_at',
      'role.id',
      'role.description',
      'profile.created_at',
      'profile.updated_at',
      'profile.deleted_at',
      'user_type.description',
      'user_type.created_at',
      'user_type.updated_at',
    ]);
  };
}
