import { Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/libs/common/constants';
import {
  ParamMockData,
  roleMockData,
  RoomTypeMock,
  usersAdminMock,
  UserTypeMockData,
} from 'src/libs/common/seeds/mocks';
import { generateRoomsMockData } from 'src/libs/common/seeds/mocks/rooms.mock';
import { Param } from 'src/modules/params/entities';
import { RoomType } from 'src/modules/room-types/entities';
import { Room } from 'src/modules/rooms/entities';
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
      const userTypeRepository = entityManager.getRepository(UserType);
      const userRepository = entityManager.getRepository(User);
      const profileRepository = entityManager.getRepository(Profile);
      const paramRepository =
        entityManager.getRepository(Param);
      const roomTypeRepository = entityManager.getRepository(RoomType);
      const roomRepository = entityManager.getRepository(Room);

      this.logger.log('Starting seeding role data...');

      await Promise.all(
        roleMockData.map(async ({ roleName, description }) => {
          await roleRepository.upsert(
            {
              roleName,
              description,
            },
            ['roleName'],
          );
        }),
      );

      this.logger.log('Starting seeding user type data...');

      await Promise.all(
        UserTypeMockData.map(
          async ({ typeName, description, surcharge_factor }) => {
            await userTypeRepository.upsert(
              {
                typeName,
                description,
                surcharge_factor,
              },
              ['typeName'],
            );
          },
        ),
      );

      this.logger.log('Seeding admin and superadmin data...');

      await Promise.all(
        usersAdminMock.map(async (data) => {
          await this.handleGenerateCreateAdminUser(
            data,
            userRepository,
            profileRepository,
            userTypeRepository,
            roleRepository,
          );
        }),
      );

      this.logger.log('Seeding param data...');

      await Promise.all(
        ParamMockData.map(
          async ({ param_name, param_value, description }) => {
            await paramRepository.upsert(
              {
                paramName: param_name,
                paramValue: param_value,
                description,
              },
              ['paramName'],
            );
          },
        ),
      );

      this.logger.log('Seeding room type data...');

      await Promise.all(
        RoomTypeMock.map(async ({ name, description, roomPrice }) => {
          await roomTypeRepository.upsert(
            {
              name,
              description,
              roomPrice,
            },
            ['name'],
          );
        }),
      );

      this.logger.log('Seeding rooms data...');

      const roomTypeA = await this.handleGetRoomType('A', roomTypeRepository);
      const roomTypeB = await this.handleGetRoomType('B', roomTypeRepository);
      const roomTypeC = await this.handleGetRoomType('C', roomTypeRepository);

      const roomTypeMap = {
        [roomTypeA.id]: roomTypeA,
        [roomTypeB.id]: roomTypeB,
        [roomTypeC.id]: roomTypeC,
      };

      const fakeRooms = await generateRoomsMockData(roomTypeRepository);

      await Promise.all(
        fakeRooms.map(async ({ roomNumber, roomTypeId, note }) => {
          await roomRepository.upsert(
            {
              roomNumber,
              note,
              roomType: roomTypeMap[roomTypeId],
            },
            ['roomNumber'],
          );
        }),
      );

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

    if (!role)
      throw new Error(`Role for type ${type} not found in the system.`);

    const userLocalType = await userTypeRepository.findOne({
      where: {
        typeName: UserTypeEnum.LOCAL,
      },
    });

    if (!userLocalType)
      throw new NotFoundException('User local type not found.');

    await userRepository.upsert(
      {
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
        userType: userLocalType,
        role,
      },
      ['email'],
    );

    const findUser = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (!findUser) throw new Error(`User with email '${email}' not found.`);

    await profileRepository.upsert(
      {
        ...res,
        user: findUser,
      },
      ['user'],
    );
  };

  private handleGetRoomType = async (
    name: string,
    roomTypeRepository: Repository<RoomType>,
  ) => {
    const roomType = await roomTypeRepository.findOne({
      where: {
        name,
      },
    });

    if (!roomType)
      throw new Error(`Room type '${name}' not found in the system.`);

    return roomType;
  };
}
