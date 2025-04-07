import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { MAX_GUESTS_PER_ROOM } from 'src/libs/common/constants';
import { BookingDetail } from 'src/modules/booking-details/entities';
import { BookingDetailsStatus } from 'src/modules/booking-details/enums';
import { Booking } from 'src/modules/bookings/entities';
import { ConfigurationsService } from 'src/modules/configurations/configurations.service';
import { InvoicesService } from 'src/modules/invoices/invoices.service';
import { Room } from 'src/modules/rooms/entities';
import { RoomStatusEnum } from 'src/modules/rooms/enums';
import { RoomsService } from 'src/modules/rooms/rooms.service';
import { UsersService } from 'src/modules/users/users.service';
import { In } from 'typeorm';
import { RoleEnum, UserTypeEnum } from '../users/enums';
import { BookingDetailsRepository } from './booking-details.repository';
import { CreateBookingDetailDto, UpdateBookingDetailDto } from './dto';

@Injectable()
export class BookingDetailsService {
  constructor(
    @InjectRepository(BookingDetailsRepository)
    private readonly bookingDetailsRepository: BookingDetailsRepository,
    private readonly usersService: UsersService,
    private readonly invoicesService: InvoicesService,
    private readonly configurationsService: ConfigurationsService,
    private readonly roomsService: RoomsService,
  ) {}

  async create(createBookingDetailDto: CreateBookingDetailDto, userId: string) {
    const { roomId, guestCount, hasForeigners } = createBookingDetailDto;

    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User with id: '${userId}' not found.`);
    }

    const existingRoom = await this.roomsService.findOne(roomId);

    if (!existingRoom) {
      throw new NotFoundException(`Room with id: '${roomId}' not found.`);
    }

    const maxGuestsPerRoomConfig =
      await this.configurationsService.handleGetValueByName(
        MAX_GUESTS_PER_ROOM,
      );

    if (!maxGuestsPerRoomConfig)
      throw new NotFoundException(
        `Configuration for max guests per room not found.`,
      );

    if (Number(maxGuestsPerRoomConfig.configValue) < guestCount)
      throw new BadRequestException(
        `A room can accommodate up to ${maxGuestsPerRoomConfig.configValue} guests only. Please reduce the number of guests.`,
      );

    const days =
      Math.ceil(
        new Date(createBookingDetailDto.endDate).getTime() -
          new Date(createBookingDetailDto.startDate).getTime(),
      ) /
        (1000 * 60 * 60 * 24) +
      1;

    if (days <= 0) {
      throw new NotFoundException(
        `Booking detail start date must be before end date.`,
      );
    }

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

    const detailPrice =
      baseDetailPrice *
      (1 + 0.25 * (guestCount > 2 ? 1 : 0)) *
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

    newBookingDetail.invoice = newInvoice;

    return await this.bookingDetailsRepository.save(newBookingDetail);
  }

  async findAll(userId: string) {
    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User with id: '${userId}' not found.`);
    }

    return this.bookingDetailsRepository.find({
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
    });
  }

  async findOne(id: string, userId: string) {
    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User with email: '${userId}' not found.`);
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
      throw new NotFoundException(`Booking detail with id: '${id}' not found.`);
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
      throw new NotFoundException(`User with id: '${userId}' not found.`);
    }

    const existingBookingDetail = await this.bookingDetailsRepository.findOne({
      where: {
        id,
      },
      relations: ['room', 'booking', 'booking.user', 'invoice'],
    });

    if (!existingBookingDetail)
      throw new NotFoundException(`Booking detail with id '${id}' not found.`);

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

    if (startDate || endDate) {
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
    }

    const maxGuestsPerRoomConfig =
      await this.configurationsService.handleGetValueByName(
        MAX_GUESTS_PER_ROOM,
      );

    if (!maxGuestsPerRoomConfig)
      throw new NotFoundException(
        `Configuration for max guests per room not found.`,
      );

    const guestCount =
      updateBookingDetailDto?.guestCount ?? existingBookingDetail.guestCount;

    let existingRoom: Room | null = null;

    if (roomId) {
      existingRoom = await this.roomsService.findOne(roomId);

      if (!existingRoom)
        throw new NotFoundException(`Room with id: '${roomId}' not found.`);

      if (existingRoom.status === RoomStatusEnum.OCCUPIED)
        throw new BadRequestException(
          `Room with id '${roomId}' has been occupied.`,
        );

      if (
        roomId !== existingBookingDetail.room.id &&
        guestCount &&
        Number(maxGuestsPerRoomConfig.configValue) < guestCount
      )
        throw new BadRequestException(
          `A new room can accommodate up to ${maxGuestsPerRoomConfig.configValue} guests only. Please reduce the number of guests.`,
        );
    }

    await this.bookingDetailsRepository.update(
      {
        id: existingBookingDetail.id,
      },
      res,
    );

    if (roomId && existingRoom) {
      existingBookingDetail.room = existingRoom;

      await this.bookingDetailsRepository.save(existingBookingDetail);
    }

    if (days > 0) {
      const baseDetailPrice =
        (existingRoom ? existingRoom : existingBookingDetail.room).roomType
          .roomPrice * days;

      const foreignUserType = await this.usersService.handleGetUserTypeByName(
        UserTypeEnum.FOREIGN,
      );

      const localUserType = await this.usersService.handleGetUserTypeByName(
        UserTypeEnum.LOCAL,
      );

      const surcharge_factor = updateBookingDetailDto?.hasForeigners
        ? foreignUserType.surcharge_factor
        : localUserType.surcharge_factor;

      const detailPrice =
        baseDetailPrice *
        (1 + 0.25 * (guestCount > 2 ? 1 : 0)) *
        surcharge_factor;

      existingBookingDetail.totalPrice = detailPrice;

      await this.invoicesService.updateInvoice(
        existingBookingDetail.invoice.id,
        {
          basePrice: baseDetailPrice,
          totalPrice: detailPrice,
          dayRent: days,
        },
      );
    }

    return await this.bookingDetailsRepository.save(existingBookingDetail);
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
}
