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
      invoice: omit(booking.invoice, ['password', 'refresh_token']),
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
    if (checkInDate < new Date()) {
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

    await this.roomsService.handleUpdateStatusOfRoom(
      room.id,
      RoomStatusEnum.OCCUPIED,
    );

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

    if (
      existingBooking.user.id !== userId &&
      existingUser.role.roleName !== RoleEnum.ADMIN
    ) {
      throw new ForbiddenException(
        'This booking does not belong to you, so you cannot update it.',
      );
    }

    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update room if provided
      if (updateBookingDto.roomId) {
        const newRoom = await this.roomsService.findOne(
          updateBookingDto.roomId,
        );
        if (!newRoom) {
          throw new NotFoundException(`Room not found.`);
        }

        if (newRoom.status === RoomStatusEnum.OCCUPIED) {
          throw new BadRequestException(
            `Room ${newRoom.roomNumber} is already occupied.`,
          );
        }

        // Update old room status to available
        await this.roomsService.handleUpdateStatusOfRoom(
          existingBooking.room.id,
          RoomStatusEnum.AVAILABLE,
        );

        // Update new room status to occupied
        await this.roomsService.handleUpdateStatusOfRoom(
          newRoom.id,
          RoomStatusEnum.OCCUPIED,
        );

        existingBooking.room = newRoom;
      }

      // Update dates if provided
      if (updateBookingDto.checkInDate) {
        existingBooking.checkInDate = updateBookingDto.checkInDate;
      }
      if (updateBookingDto.checkOutDate) {
        existingBooking.checkOutDate = updateBookingDto.checkOutDate;
      }

      // Update participants if provided
      if (updateBookingDto.participants) {
        // Remove existing participants
        existingBooking.participants = [];

        // Add new participants
        const participants = await Promise.all(
          updateBookingDto.participants.map(async (participant) => {
            const existingParticipant =
              await this.usersService.handleGetUserByField(
                'email',
                participant.email,
              );

            if (existingParticipant) {
              return existingParticipant;
            }

            return this.usersService.handleCreateDefaultUser(participant);
          }),
        );

        existingBooking.participants = participants;
      }

      // Recalculate invoice if room or dates changed
      if (
        updateBookingDto.roomId ||
        updateBookingDto.checkInDate ||
        updateBookingDto.checkOutDate
      ) {
        const checkIn =
          updateBookingDto.checkInDate || existingBooking.checkInDate;
        const checkOut =
          updateBookingDto.checkOutDate || existingBooking.checkOutDate;
        const room = updateBookingDto.roomId
          ? existingBooking.room
          : existingBooking.room;

        const dayRent = Math.ceil(
          (checkOut!.getTime() - checkIn!.getTime()) / (1000 * 60 * 60 * 24),
        );

        const basePrice = room.roomType.roomPrice;
        const totalPrice = basePrice * dayRent;

        // Update invoice
        await this.invoicesService.update(existingBooking.invoice.id, {
          basePrice,
          totalPrice,
          dayRent,
        });

        existingBooking.totalPrice = totalPrice;
      }

      // Save the updated booking
      const updatedBooking = await queryRunner.manager.save(existingBooking);

      await queryRunner.commitTransaction();

      // Return the updated booking with relations
      return this.findOne(updatedBooking.id, userId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
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
