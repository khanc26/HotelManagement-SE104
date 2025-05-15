import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { BookingDetailsService } from 'src/modules/booking-details/booking-details.service';
import { CreateBookingDto, UpdateBookingDto } from 'src/modules/bookings/dto';
import { InvoicesService } from 'src/modules/invoices/invoices.service';
import { UsersService } from 'src/modules/users/users.service';
import { RoleEnum } from '../users/enums';
import { BookingsRepository } from './bookings.repository';
import { Booking } from './entities';
import { DeleteBookingDetailsDto } from 'src/modules/booking-details/dto';
import { format } from 'date-fns';
import { ReportsService } from 'src/modules/reports/reports.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingsRepository)
    private readonly bookingsRepository: BookingsRepository,
    private readonly usersService: UsersService,
    private readonly bookingDetailsService: BookingDetailsService,
    private readonly invoicesService: InvoicesService,
    private readonly reportsService: ReportsService,
  ) {}

  async findAll(userId: string) {
    const existingUser = await this.usersService.handleGetUserByField(
      'id',
      userId,
    );

    if (!existingUser) {
      throw new NotFoundException(`User not found.`);
    }

    let existingBookings: Booking[] = [];

    const relations = [
      'user',
      'bookingDetails',
      'bookingDetails.room',
      'bookingDetails.invoice',
    ];

    const isAdmin =
      existingUser.role.roleName === RoleEnum.ADMIN ? true : false;

    existingBookings = await this.bookingsRepository.find({
      where: isAdmin
        ? {}
        : {
            user: {
              id: userId,
            },
          },
      relations,
      select: isAdmin
        ? undefined
        : {
            id: true,
            totalPrice: true,
            createdAt: true,
            bookingDetails: {},
          },
    });

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
        'bookingDetails',
        'bookingDetails.room',
        'bookingDetails.invoice',
      ],
    });

    if (!existingBooking) {
      throw new NotFoundException(`Booking not found.`);
    }

    if (
      existingBooking.user.id !== userId &&
      existingUser.role.roleName !== RoleEnum.ADMIN
    )
      throw new ForbiddenException(
        'This booking does not belong to you, so you cannot view it.',
      );

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

  async remove(
    id: string,
    userId: string,
    deleteBookingDetailsDto?: DeleteBookingDetailsDto,
  ) {
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
      relations: {
        user: {
          role: true,
        },
        bookingDetails: true,
      },
    });

    if (!existingBooking) {
      throw new NotFoundException(`Booking with id '${id}' not found.`);
    }

    if (
      existingBooking.user.role.roleName !==
        (RoleEnum.ADMIN || RoleEnum.SUPER_ADMIN) &&
      existingBooking.user.id !== userId
    ) {
      throw new ForbiddenException(
        'You are only allowed to delete a booking that belongs to you.',
      );
    }

    const bookingIds =
      deleteBookingDetailsDto?.bookingDetailIds ??
      existingBooking.bookingDetails.map((bd) => bd.id);

    await this.bookingDetailsService.handleSoftDelete(bookingIds);

    const newTotalPrice = parseFloat(
      (
        existingBooking.totalPrice -
        (await this.invoicesService.handleCalculatePriceOfInvoicesByBookingDetailIds(
          bookingIds,
        ))
      ).toFixed(2),
    );

    const yearMonth = format(new Date(), 'yyyy-MM');

    await this.reportsService.handleCreateOrUpdateMonthlyRevenue(
      yearMonth,
      newTotalPrice === 0
        ? existingBooking.totalPrice * -1
        : newTotalPrice * -1,
    );

    existingBooking.totalPrice = newTotalPrice;

    await this.bookingsRepository.save(existingBooking);

    return omit(
      newTotalPrice === 0
        ? await this.bookingsRepository.softRemove(existingBooking)
        : existingBooking,
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

  async create({ createBookingDetailDtos }: CreateBookingDto, userId: string) {
    const user = await this.usersService.handleGetUserByField('id', userId);

    if (!user) throw new NotFoundException(`User not found.`);

    const bookingDetails = await Promise.all(
      createBookingDetailDtos.map((dto) =>
        this.bookingDetailsService.create(dto, userId),
      ),
    );

    const totalPrice = bookingDetails.reduce(
      (acc, curr) => acc + Number(curr.totalPrice),
      0,
    );

    const yearMonth = format(new Date(), 'yyyy-MM');

    await this.reportsService.handleCreateOrUpdateMonthlyRevenue(
      yearMonth,
      totalPrice,
    );

    const newBooking = this.bookingsRepository.create({
      totalPrice,
    });

    newBooking.user = user;

    await this.bookingsRepository.save(newBooking);

    await this.bookingDetailsService.handleAssignBookingDetailsToBooking(
      bookingDetails,
      newBooking,
    );

    return omit(
      await this.bookingsRepository.findOne({
        where: {
          id: newBooking.id,
        },
        relations: ['bookingDetails', 'user'],
      }),
      ['user.password'],
    );
  }

  public handleUpdate = async (
    { updateBookingDetailDtos }: UpdateBookingDto,
    userId: string,
    bookingId: string,
  ) => {
    console.log(await this.reportsService.handleGetMonthlyRevenue());

    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
      relations: {
        bookingDetails: true,
      },
    });

    if (!booking) throw new NotFoundException(`Booking not found.`);

    await Promise.all(
      updateBookingDetailDtos.map((dto) =>
        this.bookingDetailsService.updateOne(dto, userId),
      ),
    );

    const newTotalPrice =
      (await this.invoicesService.handleCalculatePriceOfInvoicesByBookingDetailIds(
        booking.bookingDetails.map((bd) => bd.id),
      )) ?? 0;

    const monthYear = format(new Date(), 'yyyy-MM');

    const distanceTotalPrice =
      parseFloat(booking.totalPrice as unknown as string) - newTotalPrice;

    if (distanceTotalPrice)
      await this.reportsService.handleCreateOrUpdateMonthlyRevenue(
        monthYear,
        distanceTotalPrice * -1,
      );

    await this.bookingsRepository.update(
      {
        id: booking.id,
      },
      {
        totalPrice: newTotalPrice,
      },
    );

    return this.findOne(bookingId, userId);
  };
}
