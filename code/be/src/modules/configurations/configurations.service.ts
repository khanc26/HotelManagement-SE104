import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from 'src/modules/configurations/entities';
import { Repository } from 'typeorm';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

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

  getAllConfigurations = async () => {
    return await this.configurationRepository.find({
      withDeleted: true,
      order: {
        createdAt: 'DESC',
      },
    });
  };

  updateConfiguration = async (
    configName: string,
    updateConfigurationDto: UpdateConfigurationDto,
  ) => {
    const existingConfig = await this.configurationRepository.findOne({
      where: {
        configName,
      },
    });

    if (!existingConfig) {
      throw new NotFoundException(
        `Configuration with name ${configName} not found`,
      );
    }

    const { id, ...existingConfigValue } = existingConfig;
    const newConfigValue = this.configurationRepository.create({
      ...existingConfigValue,
      ...updateConfigurationDto,
    });

    await this.configurationRepository.softRemove(existingConfig);
    await this.configurationRepository.save(newConfigValue);

    const configurations = await this.getAllConfigurations();
    return configurations;
  };
}
