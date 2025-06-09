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

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingsRepository)
    private readonly bookingsRepository: BookingsRepository,
    private readonly usersService: UsersService,
    private readonly invoicesService: InvoicesService,
    private readonly roomsService: RoomsService,
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

    const dayRent = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const basePrice = room.roomType.roomPrice;
    const totalPrice = basePrice * dayRent;

    const participants = await Promise.all(
      createBookingDto.participants.map(
        async (participant: CreateParticipantDto) => {
          const user = await this.usersService.handleGetUserByField(
            'email',
            participant.email,
          );

          if (!user) {
            return await this.usersService.handleCreateDefaultUser(participant);
          }

          return user;
        },
      ),
    );

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

  //   async update(id: string, updateBookingDto: UpdateBookingDto, userId: string) {
  //     const existingUser = await this.usersService.handleGetUserByField(
  //       'id',
  //       userId,
  //     );

  //     if (!existingUser) {
  //       throw new NotFoundException(`User not found.`);
  //     }

  //     const booking = await this.bookingsRepository.findOne({
  //       where: { id },
  //       relations: ['user', 'room', 'room.roomType', 'invoice', 'participants'],
  //     });

  //     if (!booking) {
  //       throw new NotFoundException(`Booking not found.`);
  //     }

  //     if (
  //       booking.user.id !== userId &&
  //       existingUser.role.roleName !== RoleEnum.ADMIN
  //     ) {
  //       throw new ForbiddenException('You can only update your own bookings.');
  //     }

  //     if (updateBookingDto.emails) {
  //       const participants = await Promise.all(
  //         updateBookingDto.emails.map(async (email) => {
  //           const user = await this.usersService.handleGetUserByField(
  //             'email',
  //             email,
  //           );
  //           if (!user) {
  //             throw new NotFoundException(`User with email ${email} not found.`);
  //           }
  //           return user;
  //         }),
  //       );
  //       booking.participants = participants;
  //     }

  //     if (updateBookingDto.checkInDate || updateBookingDto.checkOutDate) {
  //       const checkInDate = updateBookingDto.checkInDate || booking.checkInDate;
  //       const checkOutDate =
  //         updateBookingDto.checkOutDate || booking.checkOutDate;

  //       if (!checkInDate || !checkOutDate) {
  //         throw new BadRequestException('Booking dates are required');
  //       }

  //       if (checkInDate >= checkOutDate) {
  //         throw new BadRequestException(
  //           'Check-out date must be after check-in date',
  //         );
  //       }

  //       if (checkInDate < new Date()) {
  //         throw new BadRequestException('Check-in date cannot be in the past');
  //       }

  //       const dayRent = Math.ceil(
  //         (checkOutDate.getTime() - checkInDate.getTime()) /
  //           (1000 * 60 * 60 * 24),
  //       );
  //       const basePrice = booking.room.roomType.roomPrice;
  //       const totalPrice = basePrice * dayRent;

  //       const existingBookings = await this.bookingsRepository.find({
  //         where: {
  //           room: { id: booking.room.id },
  //           id: Not(booking.id),
  //           checkInDate: LessThan(checkOutDate),
  //           checkOutDate: MoreThan(checkInDate),
  //         },
  //       });

  //       if (existingBookings.length > 0) {
  //         throw new BadRequestException('Room is already booked for these dates');
  //       }

  //       await this.invoicesService.update(booking.invoice.id, {
  //         dayRent,
  //         totalPrice,
  //       });

  //       booking.totalPrice = totalPrice;
  //       booking.checkInDate = checkInDate;
  //       booking.checkOutDate = checkOutDate;
  //     }

  //     const updatedBooking = await this.bookingsRepository.save(booking);
  //     return this.findOne(updatedBooking.id, userId);
  //   }
}
