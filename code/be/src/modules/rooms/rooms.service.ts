import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/modules/bookings/entities';
import { ParamsService } from 'src/modules/params/params.service';
import { RoomType } from 'src/modules/room-types/entities';
import { RoomTypesService } from 'src/modules/room-types/room-types.service';
import {
  CreateRoomDto,
  SearchRoomsDto,
  UpdateRoomDto,
} from 'src/modules/rooms/dto';
import { Room } from 'src/modules/rooms/entities/room.entity';
import { RoomStatusEnum } from 'src/modules/rooms/enums';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    private readonly roomTypeService: RoomTypesService,
    private readonly paramsService: ParamsService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    const { roomNumber, roomTypeId } = createRoomDto;

    const existingRoomWithRoomNumber = await this.roomRepository.findOne({
      where: { roomNumber },
    });

    if (existingRoomWithRoomNumber)
      throw new BadRequestException(`This room number is already in use.`);

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
    const maxGuests =
      (await this.paramsService.handleGetValueByName('max_guests_per_room'))
        ?.paramValue ?? 3;

    const qb = this.roomRepository
      .createQueryBuilder('rooms')
      .leftJoinAndSelect('rooms.roomType', 'roomType');

    if (searchRoomsDto?.roomNumber) {
      qb.andWhere('LOWER(rooms.roomNumber) LIKE LOWER(:roomNumber)', {
        roomNumber: `%${searchRoomsDto.roomNumber}%`,
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

    const rooms = await qb.getMany();
    const currentDate = new Date();

    const activeBookings = await this.bookingRepository.find({
      where: {
        checkInDate: LessThanOrEqual(currentDate),
        checkOutDate: MoreThanOrEqual(currentDate),
      },
      relations: ['room'],
    });

    const occupiedRoomIds = new Set(
      activeBookings.map((booking) => booking.room.id),
    );

    const updatedRooms: any[] = [];

    for (const room of rooms) {
      const newStatus = occupiedRoomIds.has(room.id)
        ? RoomStatusEnum.OCCUPIED
        : RoomStatusEnum.AVAILABLE;

      if (room.status !== newStatus) {
        await this.roomRepository.update(room.id, { status: newStatus });
        room.status = newStatus;
      }

      updatedRooms.push({
        ...room,
        roomType: {
          ...room.roomType,
          maxGuests,
        },
      });
    }

    if (searchRoomsDto?.status) {
      const searchStatus = searchRoomsDto.status.toLowerCase();

      return updatedRooms.filter((room) =>
        room.status.toLowerCase().includes(searchStatus),
      );
    }

    return updatedRooms;
  }

  async findOne(id: string) {
    const findRoom = await this.roomRepository.findOne({
      where: { id },
      relations: {
        roomType: true,
      },
    });

    return findRoom;
  }

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['roomType'],
    });

    if (!room)
      throw new NotFoundException('Room not found or has been deleted.');

    const { roomTypeId, ...res } = updateRoomDto;

    if (res?.roomNumber) {
      const existingRoomNumber = await this.roomRepository.findOne({
        where: {
          roomNumber: res.roomNumber,
        },
        withDeleted: true,
      });

      if (existingRoomNumber && existingRoomNumber.id !== id)
        throw new BadRequestException(
          `Room number '${res.roomNumber}' already exists in the system.`,
        );
    }

    let roomType: RoomType | null = null;

    if (roomTypeId) {
      roomType = await this.roomTypeService.findOne(roomTypeId);

      if (!roomType) throw new NotFoundException(`Room type not found.`);
    }

    await this.roomRepository.update(
      { id },
      { ...res, ...(roomType && { roomType }) },
    );

    return this.roomRepository.findOne({
      where: { id },
      relations: ['roomType'],
    });
  }

  async removeRoom(id: string) {
    const findRoom = await this.roomRepository.findOneBy({ id });

    if (!findRoom)
      throw new NotFoundException('Room not found or has been deleted.');

    const existingBookings = await this.bookingRepository.find({
      where: {
        room: {
          id,
        },
      },
    });

    if (existingBookings?.length) {
      throw new ForbiddenException(
        `This room is linked to one or more upcoming bookings and cannot be deleted.`,
      );
    }

    await this.roomRepository.softDelete(findRoom.id);

    return await this.roomRepository.find({ relations: ['roomType'] });
  }

  public handleUpdateStatusOfRoom = async (
    roomId: string,
    status: RoomStatusEnum,
  ) => {
    try {
      const room = await this.roomRepository.findOne({
        where: {
          id: roomId,
        },
      });

      if (!room)
        throw new NotFoundException('Room not found or has been deleted.');

      room.status = status;

      await this.roomRepository.save(room);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  public handleGetRoomStatusPercentageByType = async (
    status: RoomStatusEnum,
  ) => {
    const totalByType: Array<{ roomType: string; total: string }> =
      await this.roomRepository
        .createQueryBuilder('room')
        .leftJoin('room.roomType', 'roomType')
        .select('roomType.name', 'roomType')
        .addSelect('COUNT(*)', 'total')
        .groupBy('roomType.name')
        .getRawMany();

    const countByStatus: Array<{
      roomType: string;
      status: RoomStatusEnum;
      count: string;
    }> = await this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.roomType', 'roomType')
      .select('roomType.name', 'roomType')
      .addSelect('room.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('roomType.name')
      .addGroupBy('room.status')
      .getRawMany();

    const statusMap = new Map<string, { [key in RoomStatusEnum]?: number }>();

    for (const row of countByStatus) {
      const { roomType, status, count } = row;

      if (!statusMap.has(roomType)) {
        statusMap.set(roomType, {});
      }

      statusMap.get(roomType)![status] = Number(count);
    }

    return totalByType.map((t) => {
      const roomType = t.roomType;

      const total = Number(t.total);

      const statusCounts = statusMap.get(roomType) || {};

      const statusCount = statusCounts[status] || 0;

      const percentage =
        total === 0 ? 0 : +((statusCount / total) * 100).toFixed(2);

      return {
        roomType,
        percentage,
        totalRooms: total,
        available: statusCounts[RoomStatusEnum.AVAILABLE] || 0,
        occupied: statusCounts[RoomStatusEnum.OCCUPIED] || 0,
      };
    });
  };
}
