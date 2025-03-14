import { Module } from '@nestjs/common';
import { RoomTypesModule } from 'src/room-types/room-types.module';
import { RoomTypesService } from 'src/room-types/room-types.service';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { RoomType } from 'src/room-types/entities/room-type.entity';

@Module({
  imports: [RoomTypesModule, TypeOrmModule.forFeature([Room, RoomType])],
  controllers: [RoomsController],
  providers: [RoomsService, RoomTypesService],
})
export class RoomsModule {}
