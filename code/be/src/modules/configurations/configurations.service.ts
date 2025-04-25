import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from 'src/modules/configurations/entities';
import { DataSource, Repository } from 'typeorm';
import { UpdateConfigurationDto } from './dto';

@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
    private readonly dataSource: DataSource,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const configurationRepository =
      queryRunner.manager.getRepository(Configuration);

    try {
      await configurationRepository.softRemove(existingConfig);
      await configurationRepository.save(newConfigValue);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    const configurations = await this.getAllConfigurations();
    return configurations;
  };
}
