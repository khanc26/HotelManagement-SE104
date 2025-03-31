import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../users/users.repository';
import { CreateBookingDetailDto } from './dto';
import { BookingDetailsRepository } from './booking-details.repository';
import { BookingsRepository } from '../bookings/bookings.repository';
import { RoomsRepository } from '../rooms/rooms.repository';
import { RoleEnum } from '../users/enums';
import { InvoiceDetailsRepository } from '../invoice-details/invoice-details.repository';
import { InvoicesRepository } from '../invoices/invoices.repository';
import { InvoiceDetail } from '../invoice-details/entities';
import { BookingDetail } from './entities';
import { omit } from 'lodash';

@Injectable()
export class BookingDetailsService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,

    @InjectRepository(BookingDetailsRepository)
    private readonly bookingDetailsRepository: BookingDetailsRepository,

    @InjectRepository(BookingsRepository)
    private readonly bookingsRepository: BookingsRepository,

    @InjectRepository(InvoiceDetailsRepository)
    private readonly invoiceDetailsRepository: InvoiceDetailsRepository,

    @InjectRepository(InvoicesRepository)
    private readonly invoicesRepository: InvoicesRepository,

    @InjectRepository(RoomsRepository)
    private readonly roomsRepository: RoomsRepository,
  ) {}

  async create(
    bookingId: string,
    createBookingDetailDto: CreateBookingDetailDto,
    userId: string,
  ) {
    // find user
    const existingUser = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with email: '${userId}' not found.`);
    }

    // find booking
    const existingBooking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
      relations: {
        user: true,
      },
    });
    if (!existingBooking) {
      throw new NotFoundException(`Booking with id: '${bookingId}' not found.`);
    }

    // check if user is admin or booking owner
    if (
      !(
        existingUser.role.roleName === RoleEnum.ADMIN ||
        existingUser.id === existingBooking.user.id
      )
    ) {
      throw new NotFoundException(
        `User is not authorized to create booking details.`,
      );
    }

    // find room
    const existingRoom = await this.roomsRepository.findOne({
      where: { id: createBookingDetailDto.roomId },
      relations: {
        roomType: true,
      },
    });
    if (!existingRoom) {
      throw new NotFoundException(
        `Room with id: '${createBookingDetailDto.roomId}' not found.`,
      );
    }

    // calculate days
    const days =
      Math.ceil(
        createBookingDetailDto.endDate.getTime() -
          createBookingDetailDto.startDate.getTime(),
      ) /
        (1000 * 60 * 60 * 24) +
      1;

    if (days <= 0) {
      throw new NotFoundException(
        `Booking detail start date must be before end date.`,
      );
    }

    // calculate total price
    const baseDetailPrice = existingRoom.roomType.roomPrice * days;
    const detailPrice =
      baseDetailPrice *
      (1 + 0.25 * (createBookingDetailDto.guestCount > 2 ? 1 : 0)) *
      (createBookingDetailDto.hasForeigners ? 1.5 : 1);

    // find existing booking detail
    const existingBookingDetail = await this.bookingDetailsRepository.findOne({
      where: { booking: { id: bookingId } },
      relations: {
        booking: true,
        room: true,
      },
    });
    if (!existingBookingDetail) {
      throw new NotFoundException(
        `Booking detail with booking id: '${bookingId}' not found.`,
      );
    }

    // find existing invoice detail
    const existingInvoiceDetail = await this.invoiceDetailsRepository.findOne({
      where: { bookingDetail: { id: existingBookingDetail.id } },
      relations: {
        invoice: true,
        bookingDetail: true,
      },
    });
    if (!existingInvoiceDetail) {
      throw new NotFoundException(
        `Invoice detail with booking detail id: '${bookingId}' not found.`,
      );
    }

    // find existing invoice
    const existingInvoice = await this.invoicesRepository.findOne({
      where: { id: existingInvoiceDetail.invoice.id },
      relations: {
        invoiceDetails: true,
      },
    });
    if (!existingInvoice) {
      throw new NotFoundException(
        `Invoice with id: '${existingInvoiceDetail.invoice.id}' not found.`,
      );
    }

    // create booking detail
    const newBookingDetail = new BookingDetail();
    newBookingDetail.startDate = createBookingDetailDto.startDate;
    newBookingDetail.endDate = createBookingDetailDto.endDate;
    newBookingDetail.guestCount = createBookingDetailDto.guestCount;
    newBookingDetail.hasForeigners =
      createBookingDetailDto.hasForeigners ?? false;
    newBookingDetail.room = existingRoom;
    newBookingDetail.booking = existingBooking;

    const savedBookingDetail =
      await this.bookingDetailsRepository.save(newBookingDetail);

    // create invoice detail
    const newInvoiceDetail = new InvoiceDetail();
    newInvoiceDetail.basePrice = baseDetailPrice;
    newInvoiceDetail.totalPrice = detailPrice;
    newInvoiceDetail.dayRent = days;
    newInvoiceDetail.invoice = existingInvoice;
    newInvoiceDetail.bookingDetail = savedBookingDetail;
    await this.invoiceDetailsRepository.save(newInvoiceDetail);

    // update invoice
    await this.invoicesRepository.update(existingInvoice.id, {
      basePrice: existingInvoice.basePrice + baseDetailPrice,
      totalPrice: existingInvoice.totalPrice + detailPrice,
    });

    return omit(savedBookingDetail, ['booking.user', 'room', 'invoiceDetail']);
  }

  async findAll(userId: string) {
    // find user
    const existingUser = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with email: '${userId}' not found.`);
    }

    // check if user is admin or booking owner
    if (
      !(
        existingUser.role.roleName === RoleEnum.ADMIN ||
        existingUser.role.roleName === RoleEnum.USER
      )
    ) {
      throw new ForbiddenException(
        `User does not have permission to view booking details.`,
      );
    }

    return this.bookingDetailsRepository.find({
      relations: {
        booking: true,
        room: true,
        invoiceDetail: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string, userId: string) {
    // find user
    const existingUser = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!existingUser) {
      throw new NotFoundException(`User with email: '${userId}' not found.`);
    }

    // check if user is admin or booking owner
    if (
      !(
        existingUser.role.roleName === RoleEnum.ADMIN ||
        existingUser.role.roleName === RoleEnum.USER
      )
    ) {
      throw new ForbiddenException(
        `User does not have permission to view booking details.`,
      );
    }

    const bookingDetail = await this.bookingDetailsRepository.findOne({
      where: { id },
      relations: {
        booking: true,
        room: true,
        invoiceDetail: true,
      },
    });
    if (!bookingDetail) {
      throw new NotFoundException(
        `Booking detail with id: '${id}' not found.`,
      );
    }

    return bookingDetail;
  }

  async update(id: string, updateBookingDetailDto: UpdateBookingDetailDto, userId: string) {
    
  }

  async remove() {}
}
