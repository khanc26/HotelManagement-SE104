import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from 'src/modules/configurations/entities';
import { ConfigurationsService } from './configurations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration])],
  providers: [ConfigurationsService],
  exports: [ConfigurationsService],
})
export class ConfigurationsModule {}
