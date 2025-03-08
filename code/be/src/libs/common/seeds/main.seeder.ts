import { Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  roleMockData,
  UserMockData,
  UserTypeMockData,
} from 'src/libs/common/seeds/mocks';
import { Profile } from 'src/users/entities/profile.entity';
import { Role } from 'src/users/entities/role.entity';
import { UserType } from 'src/users/entities/user-type.entity';
import { User } from 'src/users/entities/user.entity';
import { RoleEnum } from 'src/users/enums/role.enum';
import { UserTypeEnum } from 'src/users/enums/user-type.enum';
import { DataSource, QueryRunner } from 'typeorm';
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
      const userFactory = factoryManager.get(User);
      const profileRepository = entityManager.getRepository(Profile);

      this.logger.log('Starting seeding role data...');

      for (const roleData of roleMockData) {
        if (
          !(await roleRepository.findOne({
            where: { role_name: roleData.role_name },
          }))
        ) {
          const role = await roleFactory.make({
            role_name: roleData.role_name,
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
              type_name: userTypeData.type_name,
            },
          }))
        ) {
          const newUserType = await userTypeFactory.make({
            type_name: userTypeData.type_name,
            description: userTypeData.description,
          });

          await userTypeRepository.save(newUserType);
        }
      }

      this.logger.log('Seeding user admin data...');

      if (
        !(await userRepository.findOne({
          where: {
            role: {
              role_name: RoleEnum.ADMIN,
            },
          },
          relations: ['role'],
        }))
      ) {
        const { password, email, ...res } = UserMockData;

        const hashedPassword = await bcrypt.hash(
          password,
          bcrypt.genSaltSync(),
        );

        const newUserAdmin = await userFactory.make({
          email,
          password: hashedPassword,
        });

        const newProfile = profileRepository.create(res);

        await profileRepository.save(newProfile);

        const userType = await userTypeRepository.findOneBy({
          type_name: UserTypeEnum.LOCAL,
        });

        if (!userType)
          throw new NotFoundException('User type local not found in database.');

        const adminRole = await roleRepository.findOneBy({
          role_name: RoleEnum.ADMIN,
        });

        if (!adminRole)
          throw new NotFoundException(`Admin role not found in database.`);

        newUserAdmin.profile = newProfile;
        newUserAdmin.user_type = userType;
        newUserAdmin.role = adminRole;

        await userRepository.save(newUserAdmin);
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
}
