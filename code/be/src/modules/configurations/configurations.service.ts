import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from 'src/modules/configurations/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
  ) {}

  public handleGetValueByName = async (configName: string) => {
    return await this.configurationRepository.findOne({
      where: { configName },
    });
  };
}
