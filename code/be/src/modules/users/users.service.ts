import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { HashingProvider } from 'src/libs/common/providers';
import { SignUpDto } from 'src/modules/auth/dto';
import {
  AssignRoleDto,
  LockAccountDto,
  RevokeRoleDto,
  SearchUsersDto,
  UnlockAccountDto,
  UpdateUserDto,
} from 'src/modules/users/dto';
import { Profile, Role, UserType } from 'src/modules/users/entities';
import {
  ProfileStatusEnum,
  RoleEnum,
  UserTypeEnum,
} from 'src/modules/users/enums';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { UsersRepository } from './users.repository';

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
    private readonly dataSource: DataSource,
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
        relations: ['role', 'profile', 'userType'],
      }),
      [
        'password',
        'role.createdAt',
        'role.updatedAt',
        'role.deletedAt',
        'role.id',
        'role.description',
        'profile.createdAt',
        'profile.updatedAt',
        'profile.deletedAt',
        'userType.description',
        'userType.createdAt',
        'userType.updatedAt',
        'userType.deletedAt',
      ],
    );
  }

  async findAll(role: string, searchUsersDto?: SearchUsersDto) {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.userType', 'userType')
      .leftJoinAndSelect('user.role', 'role')
      .select([
        'user.id',
        'user.email',
        'profile.id',
        'profile.fullName',
        'profile.nationality',
        'profile.status',
        'profile.address',
        'profile.phoneNumber',
        'profile.dob',
        'profile.identityNumber',
        'profile.createdAt',
        'profile.updatedAt',
        'role.roleName',
        'userType.typeName',
      ]);

    if (searchUsersDto) {
      if (searchUsersDto?.address) {
        qb.andWhere('LOWER(profile.address) LIKE LOWER(:address)', {
          address: `%${searchUsersDto.address}%`,
        });
      }

      if (searchUsersDto?.email) {
        qb.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
          email: `%${searchUsersDto?.email}%`,
        });
      }

      if (searchUsersDto?.fullName) {
        qb.andWhere('LOWER(profile.fullName) LIKE LOWER(:fullName)', {
          fullName: `%${searchUsersDto.fullName}%`,
        });
      }

      if (searchUsersDto?.identityNumber) {
        qb.andWhere(
          'LOWER(profile.identityNumber) LIKE LOWER(:identityNumber)',
          {
            identityNumber: `%${searchUsersDto.identityNumber}%`,
          },
        );
      }

      if (searchUsersDto?.status) {
        qb.andWhere('profile.status = :status', {
          status: `%${searchUsersDto.status}%`,
        });
      }
    }

    if (role === 'admin') {
      qb.andWhere('role.roleName = :roleName', { roleName: 'user' });
    } else if (role === 'superadmin') {
      qb.andWhere('role.roleName != :roleName', { roleName: 'superadmin' });
    }

    return await qb.getMany();
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['role', 'profile', 'userType'],
      select: {
        id: true,
        email: true,
        profile: {
          id: true,
          fullName: true,
          nationality: true,
          status: true,
          address: true,
          phoneNumber: true,
          dob: true,
          identityNumber: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
        role: {
          roleName: true,
        },
        userType: {
          typeName: true,
        },
      },
    });
  }

  public handleDeleteUser = async (userId: string, role: string) => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user)
      throw new NotFoundException(`User with id: '${userId}' not found.`);

    user.profile.status = ProfileStatusEnum.INACTIVE;

    await this.profileRepository.softDelete({ id: user.profile.id });

    await this.userRepository.save(user);

    return this.findAll(role);
  };

  public handleGetProfileByUserId = async (userId: string) => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'role', 'userType'],
      select: {
        id: true,
        email: true,
        profile: {
          id: true,
          fullName: true,
          nationality: true,
          status: true,
          address: true,
          phoneNumber: true,
          dob: true,
          identityNumber: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
        role: {
          roleName: true,
        },
        userType: {
          typeName: true,
        },
      },
    });

    if (!user)
      throw new NotFoundException(`User with id: '${userId}' not found.`);

    return user;
  };

  public handleUpdateUser = async (
    id: string,
    updateUserDto: UpdateUserDto,
  ) => {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) throw new NotFoundException(`User with id: '${id}' not found.`);

    if (!Object.keys(updateUserDto).length)
      throw new BadRequestException(
        `You must be provide some information to update the profile.`,
      );

    const { email, ...res } = updateUserDto;

    if (email) {
      await this.userRepository.update({ id }, { email });
    }

    const profileId = user.profile.id;

    await this.profileRepository.update({ id: profileId }, res);

    return await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'profile', 'userType'],
      select: {
        id: true,
        email: true,
        profile: {
          id: true,
          fullName: true,
          nationality: true,
          status: true,
          address: true,
          phoneNumber: true,
          dob: true,
          identityNumber: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
        role: {
          roleName: true,
        },
        userType: {
          typeName: true,
        },
      },
    });
  };

  public handleGetProfileWithPassword = async (email: string) => {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
      select: {
        password: true,
        id: true,
        role: {
          roleName: true,
        },
        email: true,
      },
    });

    if (!user)
      throw new NotFoundException(`User with email: '${email}' not found.`);

    return user;
  };

  public handleGetUserTypeByName = async (typeName: UserTypeEnum) => {
    const userType = await this.userTypeRepository.findOne({
      where: {
        typeName,
      },
    });

    if (!userType)
      throw new NotFoundException(`User type ${typeName} not found.`);

    return userType;
  };

  public handleGetUserByField = async (field: string, value: string) => {
    return this.userRepository.findOne({
      where: {
        [field]: value,
      },
      relations: ['role'],
    });
  };

  public handleAssignRoleToUsers = async (
    assignRoleDto: AssignRoleDto,
    role: string,
  ) => {
    try {
      const { userIds } = assignRoleDto;

      const adminRole = await this.roleRepository.findOne({
        where: {
          roleName: RoleEnum.ADMIN,
        },
      });

      if (!adminRole)
        throw new NotFoundException(`Role admin not found in the system.`);

      await Promise.all(
        userIds.map(async (userId) => {
          const user = await this.userRepository.findOne({
            where: {
              id: userId,
            },
            relations: {
              role: true,
            },
          });

          if (!user)
            throw new BadRequestException(
              `User with id '${userId}' not found in the system.`,
            );

          if (user.role.roleName === RoleEnum.ADMIN)
            throw new BadRequestException(
              `User with id '${user.id}' already has ADMIN privileges.`,
            );

          user.role = adminRole;

          await this.userRepository.save(user);
        }),
      );

      return this.findAll(role);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  public handleRevokeRoleToUsers = async (
    revokeRoleDto: RevokeRoleDto,
    role: string,
  ) => {
    try {
      const { userIds } = revokeRoleDto;

      const userRole = await this.roleRepository.findOne({
        where: {
          roleName: RoleEnum.USER,
        },
      });

      if (!userRole)
        throw new NotFoundException(`Role user not found in the system.`);

      await Promise.all(
        userIds.map(async (userId) => {
          const user = await this.userRepository.findOne({
            where: {
              id: userId,
            },
            relations: {
              role: true,
            },
          });

          if (!user)
            throw new BadRequestException(
              `User with id '${userId}' not found in the system.`,
            );

          if (user.role.roleName === RoleEnum.USER)
            throw new BadRequestException(
              `User with id '${user.id}' already has USER privileges.`,
            );

          user.role = userRole;

          await this.userRepository.save(user);
        }),
      );

      return this.findAll(role);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  async handleLockUser(lockAccountDto: LockAccountDto, role: RoleEnum) {
    const { userIds } = lockAccountDto;

    const userRole = await this.roleRepository.findOne({
      where: {
        roleName: RoleEnum.USER,
      },
    });

    if (!userRole) {
      throw new NotFoundException(`Role user not found in the system.`);
    }

    const adminRole = await this.roleRepository.findOne({
      where: {
        roleName: RoleEnum.ADMIN,
      },
    });

    if (!adminRole) {
      throw new NotFoundException(`Role admin not found in the system.`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await Promise.all(
        userIds.map(async (userId) => {
          const user = await this.userRepository.findOne({
            where: {
              id: userId,
            },
            relations: {
              role: true,
            },
          });

          if (!user) {
            throw new BadRequestException(
              `User with id '${userId}' not found in the system or already locked.`,
            );
          }

          const isAllowed =
            user.role.roleName !== RoleEnum.ADMIN ||
            role === RoleEnum.SUPER_ADMIN;

          if (!isAllowed) {
            throw new BadRequestException(
              `User with id '${userId}' cannot be locked as they have ADMIN privileges.`,
            );
          }

          await this.userRepository.softRemove(user);
        }),
      );
      await queryRunner.commitTransaction();

      return this.findAll(role);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async handleUnlockUser(unlockAccountDto: UnlockAccountDto, role: RoleEnum) {
    const { userIds } = unlockAccountDto;

    const userRole = await this.roleRepository.findOne({
      where: {
        roleName: RoleEnum.USER,
      },
    });

    if (!userRole) {
      throw new NotFoundException(`Role user not found in the system.`);
    }

    const adminRole = await this.roleRepository.findOne({
      where: {
        roleName: RoleEnum.ADMIN,
      },
    });

    if (!adminRole) {
      throw new NotFoundException(`Role admin not found in the system.`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await Promise.all(
        userIds.map(async (userId) => {
          const user = await this.userRepository.findOne({
            withDeleted: true,
            where: {
              id: userId,
              deletedAt: Not(IsNull()),
            },
            relations: {
              role: true,
            },
          });

          if (!user) {
            throw new BadRequestException(
              `User with id '${userId}' not found in the system or already unlocked.`,
            );
          }

          const isAllowed =
            user.role.roleName !== RoleEnum.ADMIN ||
            role === RoleEnum.SUPER_ADMIN;

          if (!isAllowed) {
            throw new BadRequestException(
              `User with id '${userId}' cannot be unlocked as they have ADMIN privileges.`,
            );
          }

          await this.userRepository.recover(user);
        }),
      );
      await queryRunner.commitTransaction();

      return this.findAll(role);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
