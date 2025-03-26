import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from 'src/modules/room-types/entities';
import {
  CreateRoomTypeDto,
  UpdateRoomTypeDto,
} from 'src/modules/room-types/dto';

@Injectable()
export class RoomTypesService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
  ) {}

  async create(createRoomTypeDto: CreateRoomTypeDto) {
    const { name } = createRoomTypeDto;

    const existingRoomType = await this.roomTypeRepository.findOne({
      where: {
        name,
      },
    });

    if (existingRoomType)
      throw new BadRequestException(
        `Room type with name: '${name}' already existed.`,
      );

    const newRoomType = this.roomTypeRepository.create(createRoomTypeDto);

    await this.roomTypeRepository.save(newRoomType);

    return newRoomType;
  }

  async findAll() {
    return this.roomTypeRepository.find({ relations: ['rooms'] });
  }

  async findOne(id: string) {
    const findRoomType = await this.roomTypeRepository.findOne({
      where: { id },
      relations: ['rooms'],
    });

    if (!findRoomType)
      throw new NotFoundException(`Room type with id: '${id}' not found.`);

    return findRoomType;
  }

  async update(id: string, updateRoomTypeDto: UpdateRoomTypeDto) {
    if (!updateRoomTypeDto)
      throw new BadRequestException(
        `You must be provide some information to update room type.`,
      );

    const roomType = await this.roomTypeRepository.findOne({ where: { id } });

    if (!roomType)
      throw new NotFoundException(`Room type with id: '${id}' not found.`);

    await this.roomTypeRepository.update({ id }, updateRoomTypeDto);

    return await this.roomTypeRepository.findOne({
      where: { id },
      relations: ['rooms'],
    });
  }

  async remove(id: string) {
    const findRoomType = await this.roomTypeRepository.findOne({
      where: { id },
    });

    if (!findRoomType)
      throw new NotFoundException(`Room type with id: '${id}' not found.`);

    await this.roomTypeRepository.softDelete({ id });

    return await this.roomTypeRepository.find({ relations: ['rooms'] });
  }
}
