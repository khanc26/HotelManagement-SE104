import { Module } from '@nestjs/common';
import { RoomTypesController } from './room-types.controller';
import { RoomTypesService } from './room-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from 'src/room-types/entities/room-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType])],
  controllers: [RoomTypesController],
  providers: [RoomTypesService],
  exports: [RoomTypesService],
})
export class RoomTypesModule {}
