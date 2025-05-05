import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Param } from './entities';
import { UpdateParamDto } from './dto';

@Injectable()
export class ParamsService {
  constructor(
    @InjectRepository(Param)
    private readonly paramsRepository: Repository<Param>,
    private readonly dataSource: DataSource,
  ) {}

  public handleGetValueByName = async (paramName: string) => {
    return await this.paramsRepository.findOne({
      where: { paramName },
    });
  };

  getAllParams = async () => {
    return await this.paramsRepository.find({
      withDeleted: true,
      order: {
        createdAt: 'DESC',
      },
    });
  };

  updateParam = async (paramName: string, updateParamDto: UpdateParamDto) => {
    const existingParam = await this.paramsRepository.findOne({
      where: {
        paramName,
      },
    });

    if (!existingParam) {
      throw new NotFoundException(`Param with name ${paramName} not found`);
    }

    const { id, ...existingParamValue } = existingParam;
    const newParamValue = this.paramsRepository.create({
      ...existingParamValue,
      ...updateParamDto,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const paramRepository = queryRunner.manager.getRepository(Param);

    try {
      await paramRepository.softRemove(existingParam);
      await paramRepository.save(newParamValue);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    const params = await this.getAllParams();
    return params;
  };
}
