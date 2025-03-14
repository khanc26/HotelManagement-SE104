import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { Profile } from 'src/users/entities/profile.entity';
import { Role } from 'src/users/entities/role.entity';
import { UserType } from 'src/users/entities/user-type.entity';
import { BcryptProvider, HashingProvider } from 'src/libs/common/providers';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Role, UserType])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
