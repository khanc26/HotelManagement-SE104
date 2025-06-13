import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from 'src/modules/room-types/entities';
import { RoomTypesService } from 'src/modules/room-types/room-types.service';
import { Room } from 'src/modules/rooms/entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomTypesModule } from 'src/modules/room-types/room-types.module';
import { ParamsModule } from 'src/modules/params/params.module';
import { Param } from 'src/modules/params/entities';
import { ParamsService } from 'src/modules/params/params.service';

@Module({
  imports: [
    RoomTypesModule,
    TypeOrmModule.forFeature([Room, RoomType, Param]),
    ParamsModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomTypesService, ParamsService],
  exports: [RoomsService],
})
export class RoomsModule {}
