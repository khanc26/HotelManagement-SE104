import { Module } from '@nestjs/common';
import { RoomTypesService } from './room-types.service';
import { RoomTypesController } from './room-types.controller';

@Module({
  controllers: [RoomTypesController],
  providers: [RoomTypesService],
})
export class RoomTypesModule {}
