import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomTypesService } from 'src/room-types/room-types.service';
import { SearchRoomsDto } from 'src/rooms/dto/search-rooms.dto';
import { Room } from 'src/rooms/entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    private readonly roomTypeService: RoomTypesService,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    const { roomNumber, roomTypeId } = createRoomDto;

    const existingRoomWithRoomNumber = await this.roomRepository.findOne({
      where: { roomNumber },
    });

    if (existingRoomWithRoomNumber)
      throw new BadRequestException(
        `Room with number: '${roomNumber}' already exists.`,
      );

    const roomType = await this.roomTypeService.findOne(roomTypeId);

    let newRoom = this.roomRepository.create(createRoomDto);

    newRoom.roomType = roomType;

    await this.roomRepository.save(newRoom);

    newRoom = (await this.roomRepository.findOne({
      where: { id: newRoom.id },
      relations: ['roomType'],
    })) as Room;

    return newRoom;
  }

  async findAll(searchRoomsDto?: SearchRoomsDto) {
    const qb = this.roomRepository
      .createQueryBuilder('rooms')
      .leftJoinAndSelect('rooms.roomType', 'roomType');

    if (searchRoomsDto) {
      if (searchRoomsDto?.name) {
        qb.andWhere('LOWER(rooms.name) LIKE LOWER(:name)', {
          name: `%${searchRoomsDto.name}%`,
        });
      }

      if (searchRoomsDto?.price) {
        qb.andWhere('roomType.roomPrice = :price', {
          price: searchRoomsDto.price,
        });
      }

      if (searchRoomsDto?.roomTypeName) {
        qb.andWhere('LOWER(roomType.name) LIKE LOWER(:roomTypeName)', {
          roomTypeName: `%${searchRoomsDto.roomTypeName}%`,
        });
      }

      if (searchRoomsDto.status) {
        console.log(searchRoomsDto.status);

        qb.andWhere('LOWER(rooms.status) LIKE LOWER(:status)', {
          status: `%${searchRoomsDto.status}%`,
        });
      }
    }

    return await qb.getMany();
  }

  async findOne(id: string) {
    const findRoom = await this.roomRepository.findOne({
      where: { id },
      relations: ['roomType'],
    });

    if (!findRoom)
      throw new NotFoundException(`Room with id: '${id}' not found.`);

    return findRoom;
  }

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['roomType'],
    });

    if (!room) throw new NotFoundException(`Room with id: '${id}' not found.`);

    const { roomTypeId, ...res } = updateRoomDto;

    await this.roomRepository.update({ id }, res);

    const findRoomType = await this.roomTypeService.findOne(roomTypeId);

    if (!findRoomType)
      throw new NotFoundException(
        `Room type with id: '${roomTypeId}' not found.`,
      );

    room.roomType = findRoomType;

    await this.roomRepository.save(room);

    return room;
  }

  async removeRoom(id: string) {
    const findRoom = await this.roomRepository.findOneBy({ id });

    if (!findRoom)
      throw new NotFoundException(`Room with id: '${id}' not found.`);

    await this.roomRepository.softDelete(findRoom.id);

    return await this.roomRepository.find({ relations: ['roomType'] });
  }
}
