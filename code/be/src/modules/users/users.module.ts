import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { BcryptProvider, HashingProvider } from 'src/libs/common/providers';
import { Profile, Role, User, UserType } from 'src/modules/users/entities';

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
