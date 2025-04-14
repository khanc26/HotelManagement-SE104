import { Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/libs/common/constants';
import {
  ADMIN_USER,
  ConfigurationMockData,
  roleMockData,
  RoomTypeMock,
  SUPER_ADMIN_USER,
  UserTypeMockData,
} from 'src/libs/common/seeds/mocks';
import { Configuration } from 'src/modules/configurations/entities';
import { RoomType } from 'src/modules/room-types/entities';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { Role } from 'src/modules/users/entities/role.entity';
import { UserType } from 'src/modules/users/entities/user-type.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { RoleEnum, UserTypeEnum } from 'src/modules/users/enums';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MainSeeder implements Seeder {
  private readonly logger = new Logger(MainSeeder.name);

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const queryRunner: QueryRunner = dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const roleRepository = entityManager.getRepository(Role);
      const roleFactory = factoryManager.get(Role);
      const userTypeRepository = entityManager.getRepository(UserType);
      const userTypeFactory = factoryManager.get(UserType);
      const userRepository = entityManager.getRepository(User);
      const profileRepository = entityManager.getRepository(Profile);
      const configurationRepository =
        entityManager.getRepository(Configuration);
      const configurationFactory = factoryManager.get(Configuration);
      const roomTypeRepository = entityManager.getRepository(RoomType);
      const roomTypeFactory = factoryManager.get(RoomType);

      this.logger.log('Starting seeding role data...');

      for (const roleData of roleMockData) {
        if (
          !(await roleRepository.findOne({
            where: { roleName: roleData.roleName },
          }))
        ) {
          const role = await roleFactory.make({
            roleName: roleData.roleName,
            description: roleData.description,
          });

          await roleRepository.save(role);
        }
      }

      this.logger.log('Starting seeding user type data...');

      for (const userTypeData of UserTypeMockData) {
        if (
          !(await userTypeRepository.findOne({
            where: {
              typeName: userTypeData.typeName,
            },
          }))
        ) {
          const newUserType = await userTypeFactory.make({
            typeName: userTypeData.typeName,
            description: userTypeData.description,
            surcharge_factor: userTypeData.surcharge_factor,
          });

          await userTypeRepository.save(newUserType);
        }
      }

      this.logger.log('Seeding super base admin data...');

      await this.handleGenerateCreateAdminUser(
        SUPER_ADMIN_USER,
        userRepository,
        profileRepository,
        userTypeRepository,
        roleRepository,
      );

      this.logger.log('Seeding user admin data...');

      await this.handleGenerateCreateAdminUser(
        ADMIN_USER,
        userRepository,
        profileRepository,
        userTypeRepository,
        roleRepository,
      );

      this.logger.log('Seeding configuration data...');

      for (const configurationData of ConfigurationMockData) {
        if (
          !(await configurationRepository.findOne({
            where: {
              configName: configurationData.config_name,
            },
          }))
        ) {
          const { config_name, config_value } = configurationData;

          const newConfig = await configurationFactory.make({
            configName: config_name,
            configValue: config_value,
          });

          await configurationRepository.save(newConfig);
        }
      }

      this.logger.log('Seeding room type data...');

      for (const roomTypeData of RoomTypeMock) {
        if (
          !(await roomTypeRepository.findOne({
            where: {
              name: roomTypeData.name,
            },
          }))
        ) {
          const newRoomType = await roomTypeFactory.make(roomTypeData);

          await roomTypeRepository.save(newRoomType);
        }
      }

      this.logger.log('Seeding finished successfully.');

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private handleGenerateCreateAdminUser = async (
    data: IUser,
    userRepository: Repository<User>,
    profileRepository: Repository<Profile>,
    userTypeRepository: Repository<UserType>,
    roleRepository: Repository<Role>,
  ) => {
    const { email, type, password, ...res } = data;

    const existingUserWithEmail = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (!existingUserWithEmail) {
      const userLocalType = await userTypeRepository.findOne({
        where: {
          typeName: UserTypeEnum.LOCAL,
        },
      });

      if (!userLocalType)
        throw new NotFoundException('User local type not found.');

      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());

      let role: Role | null = null;

      if (type === 'admin') {
        role = await roleRepository.findOne({
          where: {
            roleName: RoleEnum.ADMIN,
          },
        });
      } else if (type == 'superadmin') {
        role = await roleRepository.findOne({
          where: {
            roleName: RoleEnum.SUPER_ADMIN,
          },
        });
      }

      const newUser = userRepository.create({
        password: hashedPassword,
        email,
      });

      newUser.userType = userLocalType;

      if (role) newUser.role = role;

      await userRepository.save(newUser);

      const profile = profileRepository.create(res);

      profile.user = newUser;

      await profileRepository.save(profile);
    }
  };
}
