import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoicesService } from '../invoices/invoices.service';
import { UsersService } from '../users/users.service';
import { RoleEnum, UserTypeEnum } from '../users/enums';
import { BookingsRepository } from './bookings.repository';
import {
  CreateBookingDto,
  CreateParticipantDto,
  UpdateBookingDto,
} from './dto';
import { RoomStatusEnum } from '../rooms/enums';
import { omit } from 'lodash';
import { RoomsService } from '../rooms/rooms.service';
import { LessThan, MoreThan, Not } from 'typeorm';
import { DataSource } from 'typeorm';
import { ParamsService } from 'src/modules/params/params.service';
import { User } from 'src/modules/users/entities';
import { isSameDay, startOfDay } from 'date-fns';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingsRepository)
    private readonly bookingsRepository: BookingsRepository,
    private readonly usersService: UsersService,
    private readonly invoicesService: InvoicesService,
    private readonly roomsService: RoomsService,
    private readonly dataSource: DataSource,
    private readonly paramsService: ParamsService,
  ) {}

  async findAll(userId: string) {
    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    const isAdmin = existingUser.role.roleName === RoleEnum.ADMIN;

    const bookings = await this.bookingsRepository.find({
      where: isAdmin ? {} : { user: { id: userId } },
      relations: [
        'user',
        'room',
        'room.roomType',
        'invoice',
        'participants',
        'participants.profile',
      ],
    });

    return bookings.map((booking) => ({
      ...omit(booking, [
        'password',
        'refresh_token',
        'user.password',
        'user.refresh_token',
        'participants.password',
        'participants.refresh_token',
      ]),
      user: omit(booking.user, [
        'password',
        'refresh_token',
        'user.password',
        'user.refresh_token',
      ]),
      participants: booking.participants.map((participant) => ({
        ...omit(participant, [
          'password',
          'refresh_token',
          'profile.password',
          'profile.refresh_token',
        ]),
        profile: omit(participant.profile, ['password', 'refresh_token']),
      })),
      room: {
        ...omit(booking.room, [
          'password',
          'refresh_token',
          'roomType.password',
          'roomType.refresh_token',
        ]),
        roomType: omit(booking.room.roomType, ['password', 'refresh_token']),
      },
    }));
  }

  async findOne(id: string, userId: string) {
    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        id,
      },
      relations: [
        'user',
        'room',
        'room.roomType',
        'invoice',
        'participants',
        'participants.profile',
      ],
    });

    if (!existingBooking) {
      throw new NotFoundException(`Booking not found.`);
    }

    if (
      existingBooking.user.id !== userId &&
      existingUser.role.roleName !== RoleEnum.ADMIN
    ) {
      throw new ForbiddenException(
        'This booking does not belong to you, so you cannot view it.',
      );
    }

    return {
      ...omit(existingBooking, ['deletedAt']),
      user: omit(existingBooking.user, [
        'password',
        'refresh_token',
        'deletedAt',
      ]),
      participants: existingBooking.participants.map((participant) => ({
        ...omit(participant, ['password', 'refresh_token', 'deletedAt']),
        profile: omit(participant.profile, [
          'password',
          'refresh_token',
          'deletedAt',
        ]),
      })),
      room: {
        ...omit(existingBooking.room, ['deletedAt']),
        roomType: omit(existingBooking.room.roomType, ['deletedAt']),
      },
      invoice: omit(existingBooking.invoice, ['deletedAt']),
    };
  }

  async remove(id: string, userId: string) {
    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    const booking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['user', 'room', 'invoice'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking not found.`);
    }

    if (
      booking.user.id !== userId &&
      existingUser.role.roleName !== RoleEnum.ADMIN
    ) {
      throw new ForbiddenException('You can only delete your own bookings.');
    }

    await this.roomsService.handleUpdateStatusOfRoom(
      booking.room.id,
      RoomStatusEnum.AVAILABLE,
    );

    await this.bookingsRepository.softRemove(booking);

    await this.invoicesService.handleDeleteInvoice(booking.invoice.id);

    return { message: 'Booking deleted successfully' };
  }

  async create(createBookingDto: CreateBookingDto, userId: string) {
    const user = await this.usersService.handleGetUserByField('id', userId);
    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    const room = await this.roomsService.findOne(createBookingDto.roomId);
    if (!room) {
      throw new NotFoundException(`Room not found.`);
    }
    if (room.status !== RoomStatusEnum.AVAILABLE) {
      throw new BadRequestException(`Room is not available.`);
    }

    const { checkInDate, checkOutDate } = createBookingDto;
    if (checkInDate >= checkOutDate) {
      throw new BadRequestException(
        'Check-out date must be after check-in date',
      );
    }

    if (checkInDate < startOfDay(new Date())) {
      throw new BadRequestException('Check-in date cannot be in the past');
    }

    const existingBookings = await this.bookingsRepository.find({
      where: {
        room: { id: room.id },
        checkInDate: LessThan(checkOutDate),
        checkOutDate: MoreThan(checkInDate),
      },
    });

    if (existingBookings.length > 0) {
      throw new BadRequestException('Room is already booked for these dates');
    }

    const participants: User[] = [];

    for (const participant of createBookingDto.participants) {
      let user = await this.usersService.handleGetUserByField(
        'email',
        participant.email,
      );

      if (!user) {
        user = await this.usersService.handleCreateDefaultUser(participant);
      } else {
        await this.checkValidParticipant(user);
      }

      participants.push(user);
    }

    const dayRent = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const basePrice = room.roomType.roomPrice;

    let totalPrice = basePrice * dayRent;

    const numberOfParticipants = participants.length;

    const hasForeignGuest = participants.some(
      (participant) => participant.userType.typeName === UserTypeEnum.FOREIGN,
    );

    if (numberOfParticipants > 2) {
      const surchargeRateFactor =
        await this.paramsService.handleGetValueByName('surcharge_rate');

      const additionalGuests = numberOfParticipants - 2;

      totalPrice +=
        totalPrice *
        (surchargeRateFactor?.paramValue ?? 0.25) *
        additionalGuests;
    }

    if (hasForeignGuest) {
      const foreignGuestFactor = await this.paramsService.handleGetValueByName(
        'foreign_guest_factor',
      );

      totalPrice *= foreignGuestFactor?.paramValue ?? 1.5;
    }

    const invoice = await this.invoicesService.create({
      dayRent,
      totalPrice,
      basePrice,
    });

    const booking = this.bookingsRepository.create({
      totalPrice,
      user,
      room,
      checkInDate,
      checkOutDate,
      participants,
      invoice,
    });

    if (isSameDay(checkInDate, new Date())) {
      await this.roomsService.handleUpdateStatusOfRoom(
        room.id,
        RoomStatusEnum.OCCUPIED,
      );
    }

    const savedBooking = await this.bookingsRepository.save(booking);

    if (!savedBooking) {
      throw new InternalServerErrorException('Failed to create booking');
    }

    return this.findOne(savedBooking.id, userId);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, userId: string) {
    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );
    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    const existingBooking = await this.bookingsRepository.findOne({
      where: { id },
      relations: ['user', 'room', 'room.roomType', 'invoice', 'participants'],
    });

    if (!existingBooking) {
      throw new NotFoundException(`Booking not found.`);
    }

    if (!existingBooking.user || !existingUser.role) {
      throw new InternalServerErrorException(
        'Booking user or role data is missing.',
      );
    }

    if (
      existingBooking.user.id !== userId &&
      existingUser.role.roleName !== RoleEnum.ADMIN
    ) {
      throw new ForbiddenException(
        'This booking does not belong to you, so you cannot update it.',
      );
    }

    if (
      updateBookingDto.roomId ||
      updateBookingDto.checkInDate ||
      updateBookingDto.checkOutDate
    ) {
      const roomId = updateBookingDto.roomId || existingBooking.room?.id;
      const checkInDate =
        updateBookingDto.checkInDate || existingBooking.checkInDate;
      const checkOutDate =
        updateBookingDto.checkOutDate || existingBooking.checkOutDate;

      if (!roomId) {
        throw new BadRequestException('Room ID is missing.');
      }
      if (!checkInDate || !checkOutDate) {
        throw new BadRequestException('Check-in or check-out date is missing.');
      }

      if (checkInDate >= checkOutDate) {
        throw new BadRequestException(
          'Check-out date must be after check-in date',
        );
      }

      if (checkInDate < startOfDay(new Date())) {
        throw new BadRequestException('Check-in date cannot be in the past');
      }

      const existingBookings = await this.bookingsRepository.find({
        where: {
          room: { id: roomId },
          checkInDate: LessThan(checkOutDate),
          checkOutDate: MoreThan(checkInDate),
          id: Not(id),
        },
      });

      if (existingBookings.length > 0) {
        throw new BadRequestException('Room is already booked for these dates');
      }

      if (updateBookingDto.roomId) {
        const newRoom = await this.roomsService.findOne(
          updateBookingDto.roomId,
        );
        if (!newRoom) {
          throw new NotFoundException(`Room not found.`);
        }

        if (newRoom.status === RoomStatusEnum.OCCUPIED) {
          throw new BadRequestException(
            `Room ${newRoom.roomNumber || 'unknown'} is already occupied.`,
          );
        }

        if (!existingBooking.room) {
          throw new InternalServerErrorException(
            'Current booking room data is missing.',
          );
        }

        await this.roomsService.handleUpdateStatusOfRoom(
          existingBooking.room.id,
          RoomStatusEnum.AVAILABLE,
        );

        await this.roomsService.handleUpdateStatusOfRoom(
          newRoom.id,
          RoomStatusEnum.OCCUPIED,
        );

        existingBooking.room = newRoom;
      }

      if (updateBookingDto.checkInDate) {
        existingBooking.checkInDate = updateBookingDto.checkInDate;
      }
      if (updateBookingDto.checkOutDate) {
        existingBooking.checkOutDate = updateBookingDto.checkOutDate;
      }
    }

    if (updateBookingDto.participants) {
      existingBooking.participants = [];

      const participants = await Promise.all(
        updateBookingDto.participants.map(async (participant) => {
          if (!participant.email) {
            throw new BadRequestException('Participant email is required.');
          }

          let user = await this.usersService.handleGetUserByField(
            'email',
            participant.email,
          );

          if (!user) {
            user = await this.usersService.handleCreateDefaultUser(participant);
          } else {
            await this.checkValidParticipantExcludeCurrent(user, id);
          }

          if (!user) {
            throw new InternalServerErrorException(
              'Failed to create or retrieve participant.',
            );
          }

          return user;
        }),
      );

      existingBooking.participants = participants;
    }

    if (
      updateBookingDto.roomId ||
      updateBookingDto.checkInDate ||
      updateBookingDto.checkOutDate ||
      updateBookingDto.participants
    ) {
      if (!existingBooking.room?.roomType) {
        throw new InternalServerErrorException(
          'Room or room type data is missing.',
        );
      }

      const checkIn = existingBooking.checkInDate;
      const checkOut = existingBooking.checkOutDate;
      const room = existingBooking.room;

      const dayRent = Math.ceil(
        (checkOut!.getTime() - checkIn!.getTime()) / (1000 * 60 * 60 * 24),
      );

      const basePrice = room.roomType.roomPrice;
      let totalPrice = basePrice * dayRent;

      const numberOfParticipants = existingBooking.participants?.length || 0;
      const hasForeignGuest =
        existingBooking.participants?.some(
          (participant) =>
            participant.userType?.typeName === UserTypeEnum.FOREIGN,
        ) || false;

      if (numberOfParticipants > 2) {
        const surchargeRateFactor =
          await this.paramsService.handleGetValueByName('surcharge_rate');
        const additionalGuests = numberOfParticipants - 2;
        totalPrice +=
          totalPrice *
          (surchargeRateFactor?.paramValue ?? 0.25) *
          additionalGuests;
      }

      if (hasForeignGuest) {
        const foreignGuestFactor =
          await this.paramsService.handleGetValueByName('foreign_guest_factor');
        totalPrice *= foreignGuestFactor?.paramValue ?? 1.5;
      }

      if (!existingBooking.invoice) {
        throw new InternalServerErrorException('Invoice data is missing.');
      }

      await this.invoicesService.update(existingBooking.invoice.id, {
        basePrice,
        totalPrice,
        dayRent,
      });

      existingBooking.totalPrice = totalPrice;
    }

    const updatedBooking = await this.bookingsRepository.save(existingBooking);

    if (
      existingBooking.room &&
      isSameDay(existingBooking.checkInDate!, new Date())
    ) {
      await this.roomsService.handleUpdateStatusOfRoom(
        existingBooking.room.id,
        RoomStatusEnum.OCCUPIED,
      );
    }

    return this.findOne(updatedBooking.id, userId);
  }

  private async checkValidParticipantExcludeCurrent(
    user: User,
    excludeBookingId?: string,
  ) {
    if (!user.id) {
      throw new BadRequestException('User ID is missing.');
    }

    const now = new Date();

    const whereConditions: any = {
      checkOutDate: MoreThan(now),
      participants: {
        id: user.id,
      },
    };

    if (excludeBookingId) {
      whereConditions.id = Not(excludeBookingId);
    }

    const existingValidBookings = await this.bookingsRepository.find({
      where: whereConditions,
      relations: {
        participants: true,
      },
    });

    if (existingValidBookings.length > 0) {
      throw new BadRequestException(
        `The user with email '${user.email || 'unknown'}' is already part of a booking that hasn't reached its checkout date and cannot be added to another.`,
      );
    }
  }

  private checkValidParticipant = async (user: User) => {
    const now = new Date();

    const existingValidBookings = await this.bookingsRepository.find({
      where: {
        checkOutDate: MoreThan(now),
        participants: {
          id: user.id,
        },
      },
      relations: {
        participants: true,
      },
    });

    if (existingValidBookings.length > 0)
      throw new BadRequestException(
        `The user with email '${user.email}' is already part of a booking that hasn't reached its checkout date and cannot be added to another.`,
      );
  };
}
