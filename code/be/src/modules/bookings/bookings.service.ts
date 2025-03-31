import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto, UpdateBookingDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingsRepository } from './bookings.repository';
import { RoomStatusEnum } from '../rooms/enums';
import { BookingDetail } from '../booking-details/entities';
import { Booking } from './entities';
import { BookingsStatus } from './enums';
import { Invoice } from '../invoices/entities';
import { InvoiceDetail } from '../invoice-details/entities/invoice-detail.entity';
import { InvoicesStatus } from '../invoices/enums';
import { InvoicesRepository } from '../invoices/invoices.repository';
import { InvoiceDetailsRepository } from '../invoice-details/invoice-details.repository';
import { BookingDetailsRepository } from '../booking-details/booking-details.repository';
import { RoomsRepository } from '../rooms/rooms.repository';
import { UsersRepository } from '../users/users.repository';
import { DataSource } from 'typeorm';
import { omit } from 'lodash';
import { RoleEnum } from '../users/enums';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingsRepository)
    private readonly bookingsRepository: BookingsRepository,

    @InjectRepository(InvoiceDetailsRepository)
    private readonly invoiceDetailRepository: InvoiceDetailsRepository,

    @InjectRepository(InvoicesRepository)
    private readonly invoicesRepository: InvoicesRepository,

    @InjectRepository(BookingDetailsRepository)
    private readonly bookingDetailsRepository: BookingDetailsRepository,

    @InjectRepository(RoomsRepository)
    private readonly roomsRepository: RoomsRepository,

    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,

    private readonly dataSource: DataSource,
  ) {}
  async create(createBookingDto: CreateBookingDto, userId: string) {
    // find user
    const existingUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with email: '${userId}' not found.`);
    }

    // global variables
    let totalBasePrice = 0;
    let totalPrice = 0;

    // contains all booking details
    const tempForBookingDetails: BookingDetail[] = [];
    const tempForBasePrice: number[] = [];
    const tempForTotalPrice: number[] = [];
    const tempForDayRent: number[] = [];

    for (const bookingDetail of createBookingDto.bookingDetails) {
      // find room
      const existingRoom = await this.roomsRepository.findOne({
        where: {
          id: bookingDetail.roomId,
        },
        relations: {
          roomType: true,
        },
      });
      if (!existingRoom) {
        throw new NotFoundException(
          `Room with id: '${bookingDetail.roomId}' not found.`,
        );
      }

      // check if room is available
      if (existingRoom.status === RoomStatusEnum.OCCUPIED) {
        throw new BadRequestException(
          `Room with id: '${bookingDetail.roomId}' is already occupied.`,
        );
      }

      // calculate days
      const days =
        Math.ceil(
          bookingDetail.endDate.getTime() - bookingDetail.startDate.getTime(),
        ) /
          (1000 * 60 * 60 * 24) +
        1;
      if (days <= 0) {
        throw new BadRequestException(
          `End date must be greater than start date.`,
        );
      }

      // calculate price
      const baseDetailPrice = existingRoom.roomType.roomPrice * days;
      const detailPrice =
        baseDetailPrice *
        (1 + 0.25 * (bookingDetail.guestCount > 2 ? 1 : 0)) *
        (bookingDetail.hasForeigners ? 1.5 : 1);

      // create booking detail
      const newBookingDetail = new BookingDetail();
      newBookingDetail.room = existingRoom;
      newBookingDetail.guestCount = bookingDetail.guestCount;
      newBookingDetail.startDate = bookingDetail.startDate;
      newBookingDetail.endDate = bookingDetail.endDate;
      newBookingDetail.hasForeigners = bookingDetail.hasForeigners || false;
      tempForBookingDetails.push(newBookingDetail);

      // push price
      tempForBasePrice.push(baseDetailPrice);
      tempForTotalPrice.push(detailPrice);

      // push day rent
      tempForDayRent.push(days);

      // total price
      totalBasePrice += baseDetailPrice;
      totalPrice += detailPrice;
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // create booking
      const newBooking = new Booking();
      newBooking.status = createBookingDto.status || BookingsStatus.PENDING;
      newBooking.user = existingUser;
      const savedBooking = await queryRunner.manager.save(newBooking);

      // create invoice
      const newInvoice = new Invoice();
      newInvoice.basePrice = totalBasePrice;
      newInvoice.totalPrice = totalPrice;
      newInvoice.status = InvoicesStatus.UNPAID;
      const savedInvoice = await queryRunner.manager.save(newInvoice);

      for (let i = 0; i < tempForBookingDetails.length; i++) {
        tempForBookingDetails[i].booking = savedBooking;
        const savedBookingDetail = await queryRunner.manager.save(
          tempForBookingDetails[i],
        );
        const newInvoiceDetail = new InvoiceDetail();
        newInvoiceDetail.bookingDetail = savedBookingDetail;
        newInvoiceDetail.invoice = savedInvoice;
        newInvoiceDetail.basePrice = tempForBasePrice[i];
        newInvoiceDetail.totalPrice = tempForTotalPrice[i];
        newInvoiceDetail.status = InvoicesStatus.UNPAID;
        newInvoiceDetail.dayRent = tempForDayRent[i];
        await queryRunner.manager.save(newInvoiceDetail);
      }

      await queryRunner.commitTransaction();

      return omit(
        await this.bookingsRepository.findOne({
          where: {
            id: savedBooking.id,
          },
          relations: ['user'],
        }),
        [
          'user.password',
          'user.role',
          'user.userType',
          'user.createdAt',
          'user.updatedAt',
          'user.deletedAt',
          'user.profile.createdAt',
          'user.profile.updatedAt',
          'user.profile.deletedAt',
        ],
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: string) {
    // find user
    const existingUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        role: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with id: '${userId}' not found.`);
    }

    // global variables
    let existingBookings: Booking[] = [];

    // check role and find
    if (existingUser.role.roleName === RoleEnum.ADMIN) {
      existingBookings = await this.bookingsRepository.find({
        where: {},
        relations: ['user'],
      });
    } else if (existingUser.role.roleName === RoleEnum.USER) {
      existingBookings = await this.bookingsRepository.find({
        where: {
          user: { id: userId },
        },
        relations: ['user'],
      });
    } else {
      throw new ForbiddenException('Access denied');
    }

    // map bookings to remove sensitive data
    return existingBookings.map((booking) => {
      return omit(booking, [
        'user.password',
        'user.role',
        'user.userType',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt',
        'user.profile.createdAt',
        'user.profile.updatedAt',
        'user.profile.deletedAt',
      ]);
    });
  }

  async findOne(id: string, userId: string) {
    // find user
    const existingUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        role: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with id: '${userId}' not found.`);
    }

    // find booking
    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });
    if (!existingBooking) {
      throw new NotFoundException(`Booking with id: '${id}' not found.`);
    }

    // check admin or owner
    if (
      !(existingUser.role.roleName === RoleEnum.ADMIN || existingBooking.user.id === existingUser.id)
    ) {
      throw new ForbiddenException('Access denied');
    }

    return omit(existingBooking, [
      'user.password',
      'user.role',
      'user.userType',
      'user.createdAt',
      'user.updatedAt',
      'user.deletedAt',
      'user.profile.createdAt',
      'user.profile.updatedAt',
      'user.profile.deletedAt',
    ]);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, userId: string) {
    // find user
    const existingUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        role: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with id: '${userId}' not found.`);
    }

    // find booking
    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
    if (!existingBooking) {
      throw new Error('Booking not found');
    }

    // check if user is admin or booking owner
    if (
      !(existingUser.role.roleName === RoleEnum.ADMIN || existingBooking.user.id === existingUser.id)
    ) {
      throw new Error('You are not allowed to update this booking');
    }

    // update booking
    const updatedBooking = await this.bookingsRepository.update(id, {
      ...updateBookingDto,
    });
    if (!updatedBooking.affected) {
      throw new NotFoundException(`Error booking with id: '${id}' not found.`);
    }

    return omit(
      await this.bookingsRepository.findOne({
        where: {
          id,
        },
        relations: ['user'],
      }),
      [
        'user.password',
        'user.role',
        'user.userType',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt',
        'user.profile.createdAt',
        'user.profile.updatedAt',
        'user.profile.deletedAt',
      ],
    );
  }

  async remove(id: string, userId: string) {
    // find user
    const existingUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        role: true,
      },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with id: '${userId}' not found.`);
    }

    // find booking
    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
    if (!existingBooking) {
      throw new Error('Booking not found');
    }

    // check if user is admin or booking owner
    if (
      !(existingUser.role.roleName === RoleEnum.ADMIN || existingBooking.user.id === existingUser.id)
    ) {
      throw new Error('You are not allowed to remove this booking');
    }

    // soft delete booking details
    await this.bookingDetailsRepository.softDelete({
      booking: { id },
    });

    return omit(await this.bookingsRepository.softRemove(existingBooking), [
      'user.password',
      'user.role',
      'user.userType',
      'user.createdAt',
      'user.updatedAt',
      'user.deletedAt',
      'user.profile.createdAt',
      'user.profile.updatedAt',
      'user.profile.deletedAt',
    ]);
  }
}
