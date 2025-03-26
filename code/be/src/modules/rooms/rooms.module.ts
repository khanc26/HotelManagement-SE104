import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from 'src/modules/room-types/entities';
import { RoomTypesService } from 'src/modules/room-types/room-types.service';
import { Room } from 'src/modules/rooms/entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomTypesModule } from 'src/modules/room-types/room-types.module';

@Module({
  imports: [RoomTypesModule, TypeOrmModule.forFeature([Room, RoomType])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomTypesService],
})
export class RoomsModule {}
