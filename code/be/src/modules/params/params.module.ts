import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Param } from './entities';
import { ParamsService } from './params.service';
import { ParamsController } from './params.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Param])],
  providers: [ParamsService],
  exports: [ParamsService],
  controllers: [ParamsController],
})
export class ParamsModule {}
