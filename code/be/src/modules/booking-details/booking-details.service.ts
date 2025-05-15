import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { MAX_GUESTS_PER_ROOM, SURCHARGE_RATE } from 'src/libs/common/constants';
import { BookingDetail } from 'src/modules/booking-details/entities';
import { BookingDetailsStatus } from 'src/modules/booking-details/enums';
import { Booking } from 'src/modules/bookings/entities';
import { InvoicesService } from 'src/modules/invoices/invoices.service';
import { Room } from 'src/modules/rooms/entities';
import { RoomStatusEnum } from 'src/modules/rooms/enums';
import { RoomsService } from 'src/modules/rooms/rooms.service';
import { UsersService } from 'src/modules/users/users.service';
import { DataSource, In } from 'typeorm';
import { RoleEnum, UserTypeEnum } from '../users/enums';
import { BookingDetailsRepository } from './booking-details.repository';
import { CreateBookingDetailDto, UpdateBookingDetailDto } from './dto';
import { ParamsService } from '../params/params.service';

@Injectable()
export class BookingDetailsService {
  constructor(
    @InjectRepository(BookingDetailsRepository)
    private readonly bookingDetailsRepository: BookingDetailsRepository,
    private readonly usersService: UsersService,
    private readonly invoicesService: InvoicesService,
    private readonly paramsService: ParamsService,
    private readonly roomsService: RoomsService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async create(createBookingDetailDto: CreateBookingDetailDto, userId: string) {
    const { roomId, guestCount, hasForeigners } = createBookingDetailDto;

    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    const existingRoom = await this.roomsService.findOne(roomId);

    if (!existingRoom) {
      throw new NotFoundException('Room not found or has been deleted.');
    }

    if (existingRoom.status === RoomStatusEnum.OCCUPIED)
      throw new BadRequestException(
        `The room with number '${existingRoom.roomNumber}' is currently occupied.`,
      );

    const maxGuestsPerRoomParam =
      await this.paramsService.handleGetValueByName(MAX_GUESTS_PER_ROOM);

    if (!maxGuestsPerRoomParam)
      throw new NotFoundException(`Param for max guests per room not found.`);

    if (Number(maxGuestsPerRoomParam.paramValue) < guestCount)
      throw new BadRequestException(
        `A room can accommodate up to ${maxGuestsPerRoomParam.paramValue} guests only. Please reduce the number of guests.`,
      );

    const { startDate, endDate } = createBookingDetailDto;

    const now = new Date().getTime();

    const start = new Date(startDate).getTime();

    const end = new Date(endDate).getTime();

    if (start >= end)
      throw new BadRequestException(
        `End date must be greater than start date.`,
      );

    if (start <= now)
      throw new BadRequestException('Start date must be in the future.');

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const baseDetailPrice = existingRoom.roomType.roomPrice * days;

    const foreignUserType = await this.usersService.handleGetUserTypeByName(
      UserTypeEnum.FOREIGN,
    );

    const localUserType = await this.usersService.handleGetUserTypeByName(
      UserTypeEnum.LOCAL,
    );

    const surcharge_factor = hasForeigners
      ? foreignUserType.surcharge_factor
      : localUserType.surcharge_factor;

    const surchargeRate =
      await this.paramsService.handleGetValueByName(SURCHARGE_RATE);

    if (!surchargeRate)
      throw new NotFoundException(`Param for surcharge rate not found.`);

    const detailPrice =
      baseDetailPrice *
      (1 + surchargeRate.paramValue * (guestCount > 2 ? 1 : 0)) *
      surcharge_factor;

    const newBookingDetail = this.bookingDetailsRepository.create(
      omit(createBookingDetailDto, ['roomId', 'hasForeigners']),
    );

    newBookingDetail.hasForeigners =
      createBookingDetailDto.hasForeigners ?? false;

    newBookingDetail.room = existingRoom;

    const newInvoice = await this.invoicesService.createInvoice({
      basePrice: baseDetailPrice,
      totalPrice: detailPrice,
      dayRent: days,
    });

    await this.roomsService.handleUpdateStatusOfRoom(
      existingRoom.id,
      RoomStatusEnum.OCCUPIED,
    );

    newBookingDetail.invoice = newInvoice;

    newBookingDetail.totalPrice = detailPrice;

    return await this.bookingDetailsRepository.save(newBookingDetail);
  }

  async findAll(userId: string) {
    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    return (
      await this.bookingDetailsRepository.find({
        relations: {
          booking: {
            user: true,
          },
          room: true,
          invoice: true,
        },
        where:
          existingUser.role.roleName === RoleEnum.ADMIN
            ? {}
            : {
                booking: {
                  user: {
                    id: existingUser.id,
                  },
                },
              },
        order: {
          createdAt: 'DESC',
        },
      })
    ).map((bd) => omit(bd, ['booking.user.password']));
  }

  async findOne(id: string, userId: string) {
    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    const bookingDetail = await this.bookingDetailsRepository.findOne({
      where:
        existingUser.role.roleName !== RoleEnum.ADMIN
          ? {
              id,
              booking: {
                user: {
                  id: existingUser.id,
                },
              },
            }
          : { id },
      relations: {
        booking: {
          user: true,
        },
        room: true,
        invoice: true,
      },
    });

    if (!bookingDetail) {
      throw new NotFoundException(
        'The booking details you are looking for could not be found.',
      );
    }

    return bookingDetail;
  }

  public updateOne = async (
    updateBookingDetailDto: UpdateBookingDetailDto,
    userId: string,
  ) => {
    const { bookingDetailId: id } = updateBookingDetailDto;

    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    const existingBookingDetail = await this.bookingDetailsRepository.findOne({
      where: {
        id,
      },
      relations: [
        'room',
        'booking',
        'booking.user',
        'invoice',
        'room.roomType',
      ],
    });

    if (!existingBookingDetail)
      throw new NotFoundException(
        'The booking details you are looking for could not be found.',
      );

    if (
      existingBookingDetail.status === BookingDetailsStatus.CANCELLED ||
      existingBookingDetail.status === BookingDetailsStatus.CHECKED_OUT
    ) {
      throw new ConflictException(
        `Booking update failed: status is already ${existingBookingDetail.status.toLowerCase()}.`,
      );
    }

    if (
      existingBookingDetail.booking.user.id !== userId &&
      existingUser.role.roleName !== RoleEnum.ADMIN
    )
      throw new ForbiddenException(
        `You can only update the booking details that belongs to you.`,
      );

    const { roomId, ...res } = updateBookingDetailDto;

    if (
      updateBookingDetailDto?.approvalStatus &&
      existingUser.role.roleName !== RoleEnum.ADMIN
    )
      throw new ForbiddenException(
        `Only admin can have permission to update approval status of the booking detail.`,
      );

    const { startDate, endDate } = updateBookingDetailDto || {};

    let days: number = 0;

    const now = new Date().getTime();

    if (!endDate && startDate) {
      if (now <= startDate.getTime())
        throw new BadRequestException(
          `New start date must be greater than current date.`,
        );

      if (startDate.getTime() > existingBookingDetail.endDate.getTime())
        throw new BadRequestException(
          `New start date can't be greater than end date of the booking detail.`,
        );
    }

    if (!startDate && endDate) {
      if (now <= endDate.getTime())
        throw new BadRequestException(
          `New end date must be greater than current date.`,
        );

      if (endDate.getTime() < existingBookingDetail.startDate.getTime())
        throw new BadRequestException(
          `New end date must be greater than start date of the booking detail.`,
        );
    }

    if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
      throw new BadRequestException(
        `New start date can't be greater than new end date.`,
      );
    }

    days =
      Math.ceil(
        (endDate ? endDate : existingBookingDetail.endDate).getTime() -
          (startDate ? startDate : existingBookingDetail.startDate).getTime(),
      ) /
        (1000 * 60 * 60 * 24) +
      1;

    const maxGuestsPerRoomParam =
      await this.paramsService.handleGetValueByName(MAX_GUESTS_PER_ROOM);

    if (!maxGuestsPerRoomParam)
      throw new NotFoundException(`Param for max guests per room not found.`);

    const guestCount =
      updateBookingDetailDto?.guestCount ?? existingBookingDetail.guestCount;

    if (guestCount > maxGuestsPerRoomParam.paramValue)
      throw new BadRequestException(
        `A room can accommodate up to ${maxGuestsPerRoomParam.paramValue} guests only. Please reduce the number of guests.`,
      );

    let existingRoom: Room | null = existingBookingDetail.room;

    if (roomId) {
      existingRoom = await this.roomsService.findOne(roomId);

      if (!existingRoom)
        throw new NotFoundException(`Room with id: '${roomId}' not found.`);

      if (existingRoom.status === RoomStatusEnum.OCCUPIED)
        throw new BadRequestException(`This room has been occupied.`);

      if (
        roomId !== existingBookingDetail.room.id &&
        guestCount &&
        Number(maxGuestsPerRoomParam.paramValue) < guestCount
      )
        throw new BadRequestException(
          `A new room can accommodate up to ${maxGuestsPerRoomParam.paramValue} guests only. Please reduce the number of guests.`,
        );
    }

    const dataToUpdate = Object.fromEntries(
      Object.entries(res).filter(
        ([key, value]) =>
          key !== 'bookingDetailId' && value !== null && value !== undefined,
      ),
    );

    await this.bookingDetailsRepository.update(
      { id: existingBookingDetail.id },
      dataToUpdate,
    );

    if (roomId && existingRoom)
      await this.dataSource
        .createQueryBuilder()
        .relation('BookingDetails', 'room')
        .of(existingBookingDetail.id)
        .set(existingRoom.id);

    const baseDetailPrice =
      existingBookingDetail.room.roomType.roomPrice * days;

    const foreignUserType = await this.usersService.handleGetUserTypeByName(
      UserTypeEnum.FOREIGN,
    );

    const localUserType = await this.usersService.handleGetUserTypeByName(
      UserTypeEnum.LOCAL,
    );

    const surcharge_factor = updateBookingDetailDto?.hasForeigners
      ? foreignUserType.surcharge_factor
      : localUserType.surcharge_factor;

    const surchargeRate =
      await this.paramsService.handleGetValueByName(SURCHARGE_RATE);

    if (!surchargeRate)
      throw new NotFoundException(`Param for surcharge rate not found.`);

    const detailPrice =
      baseDetailPrice *
      (1 + surchargeRate.paramValue * (guestCount > 2 ? 1 : 0)) *
      surcharge_factor;

    await this.bookingDetailsRepository.update(
      {
        id: existingBookingDetail.id,
      },
      {
        totalPrice: detailPrice,
      },
    );

    await this.invoicesService.updateInvoice(existingBookingDetail.invoice.id, {
      basePrice: baseDetailPrice,
      totalPrice: detailPrice,
      dayRent: days,
    });
  };

  public handleAssignBookingDetailsToBooking = async (
    bookingDetails: BookingDetail[],
    booking: Booking,
  ) => {
    for (const bookingDetail of bookingDetails) {
      bookingDetail.booking = booking;

      await this.bookingDetailsRepository.save(bookingDetail);
    }
  };

  public handleSoftDelete = async (bookingDetailIds: string[]) => {
    await this.bookingDetailsRepository.update(
      {
        id: In(bookingDetailIds),
      },
      {
        status: BookingDetailsStatus.CANCELLED,
      },
    );

    await this.bookingDetailsRepository.softDelete(bookingDetailIds);
  };

  public async getRevenueByRoomTypeInMonth(
    month: string,
  ): Promise<Array<{ roomType: string; revenue: number; percent: string }>> {
    const totalRevenueResult: { totalRevenue: string } | undefined =
      await this.dataSource
        .getRepository(BookingDetail)
        .createQueryBuilder('bd')
        .innerJoin('bd.booking', 'booking')
        .innerJoin('bd.room', 'room')
        .innerJoin('room.roomType', 'roomType')
        .select('SUM(bd.totalPrice)', 'totalRevenue')
        .where("DATE_FORMAT(booking.createdAt, '%Y-%m') = :month", { month })
        .andWhere('booking.deletedAt IS NULL')
        .getRawOne();

    const totalRevenue = parseFloat(totalRevenueResult?.totalRevenue ?? '0');

    const roomTypeRevenues: Array<{
      revenue: string;
      roomType: string;
    }> = await this.dataSource
      .getRepository(BookingDetail)
      .createQueryBuilder('bd')
      .innerJoin('bd.booking', 'booking')
      .innerJoin('bd.room', 'room')
      .innerJoin('room.roomType', 'roomType')
      .select('roomType.name', 'roomType')
      .addSelect('SUM(bd.totalPrice)', 'revenue')
      .where("DATE_FORMAT(booking.createdAt, '%Y-%m') = :month", { month })
      .andWhere('booking.deletedAt IS NULL')
      .groupBy('roomType.name')
      .orderBy('revenue', 'DESC')
      .getRawMany();

    return roomTypeRevenues.map((item) => {
      const revenue = parseFloat(item.revenue);

      const percent = totalRevenue
        ? ((revenue / totalRevenue) * 100).toFixed(2)
        : '0.00';

      return {
        roomType: item.roomType,
        revenue,
        percent: `${percent}`,
      };
    });
  }
}
