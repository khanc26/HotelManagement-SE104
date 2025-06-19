import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptProvider, HashingProvider } from 'src/libs/common/providers';
import { Profile, Role, User, UserType } from 'src/modules/users/entities';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { Booking } from 'src/modules/bookings/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Role, UserType, Booking])],
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
