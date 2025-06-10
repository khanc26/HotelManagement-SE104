import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportsService } from 'src/modules/reports/reports.service';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto';
import { Invoice } from './entities';
import { InvoicesStatus } from './enums/invoices-status.enum';
import { format } from 'date-fns';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly reportsService: ReportsService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      status: InvoicesStatus.UNPAID,
    });
    return this.invoiceRepository.save(invoice);
  }

  async findOne(id: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['booking', 'payment'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    return invoice;
  }

  async updateStatus(id: string, status: InvoicesStatus) {
    const invoice = await this.findOne(id);
    invoice.status = status;
    return this.invoiceRepository.save(invoice);
  }

  async findByBookingId(bookingId: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { booking: { id: bookingId } },
      relations: ['booking', 'payment'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice for booking ${bookingId} not found`);
    }

    return invoice;
  }

  async update(id: string, updateData: Partial<Invoice>) {
    const invoice = await this.findOne(id);
    Object.assign(invoice, updateData);
    return this.invoiceRepository.save(invoice);
  }

  public getInvoicesByMonthOrYear = async (
    year?: number,
    month?: number,
  ): Promise<Invoice[]> => {
    if (!(year || month)) return this.invoiceRepository.find();

    const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice');

    if (year) {
      queryBuilder.andWhere('EXTRACT(YEAR FROM invoice.updatedAt) = :year', {
        year,
      });
    }

    if (month) {
      queryBuilder.andWhere('EXTRACT(MONTH FROM invoice.updatedAt) = :month', {
        month,
      });

      if (!year)
        queryBuilder.andWhere('EXTRACT(YEAR FROM invoice.updatedAt) = :year', {
          year: new Date().getFullYear(),
        });
    }

    queryBuilder.orderBy('invoice.updatedAt', 'ASC');

    return await queryBuilder.getMany();
  };

  // public handleGetInvoices = async (role: string, userId: string) => {
  //   return (
  //     await this.invoiceRepository.find({
  //       where:
  //         role === 'admin'
  //           ? {}
  //           : {
  //               bookingDetail: {
  //                 booking: {
  //                   user: {
  //                     id: userId,
  //                   },
  //                 },
  //               },
  //             },
  //       relations: [
  //         'bookingDetail',
  //         'bookingDetail.booking',
  //         'bookingDetail.booking.user',
  //         'bookingDetail.room',
  //       ],
  //     })
  //   ).map((invoice) => ({
  //     ...invoice,
  //     bookingDetail: {
  //       ...invoice.bookingDetail,
  //       booking: {
  //         ...invoice.bookingDetail.booking,
  //         user: omit(invoice.bookingDetail.booking.user, ['password']),
  //       },
  //     },
  //   }));
  // };
  // public handleGetInvoice = async (
  //   role: string,
  //   userId: string,
  //   invoiceId: string,
  // ) => {
  //   const invoice = await this.invoiceRepository.findOne({
  //     where: {
  //       id: invoiceId,
  //     },
  //     relations: {
  //       bookingDetail: {
  //         booking: {
  //           user: true,
  //         },
  //         room: true,
  //       },
  //     },
  //   });
  //   if (!invoice) throw new NotFoundException(`Invoice not found.`);
  //   if (invoice.bookingDetail.booking.user.id !== userId && role !== 'admin')
  //     throw new ForbiddenException(
  //       `You can have permission to get the invoice that belongs to you.`,
  //     );
  //   return {
  //     ...invoice,
  //     bookingDetail: {
  //       ...invoice.bookingDetail,
  //       booking: {
  //         ...invoice.bookingDetail.booking,
  //         user: omit(invoice.bookingDetail.booking.user, ['password']),
  //       },
  //       room: {
  //         ...invoice.bookingDetail.room,
  //       },
  //     },
  //   };
  // };
  // public handleDeleteInvoice = async (invoiceId: string) => {
  //   const invoice = await this.invoiceRepository.findOne({
  //     where: {
  //       id: invoiceId,
  //     },
  //   });
  //   if (!invoice) throw new NotFoundException(`Invoice not found.`);
  //   await this.invoiceRepository.delete(invoiceId);
  //   return {
  //     success: true,
  //     message: `Invoice '${invoiceId}' deleted successfully.`,
  //   };
  // };
  // public handleCalculatePriceOfInvoicesByBookingDetailIds = async (
  //   bookingDetailIds: string[],
  // ) => {
  //   return (
  //     await this.invoiceRepository.find({
  //       where: {
  //         bookingDetail: {
  //           id: In(bookingDetailIds),
  //         },
  //       },
  //       relations: {
  //         bookingDetail: true,
  //       },
  //     })
  //   ).reduce((acc, curr) => acc + Number(curr.totalPrice), 0);
  // };

  public handleUpdateStatusOfInvoice = async (
    invoiceId: string,
    vnp_ResponseCode: string,
    vnp_TransactionStatus: string,
  ) => {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: invoiceId,
      },
    });

    if (!invoice) throw new NotFoundException(`Invoice not found.`);

    const status =
      vnp_ResponseCode === '00' && vnp_TransactionStatus === '00'
        ? InvoicesStatus.PAID
        : InvoicesStatus.UNPAID;

    invoice.status = status;

    if (status === InvoicesStatus.PAID) {
      const formattedDateTimeString = format(invoice.updatedAt, 'yyyy-mm');

      await this.reportsService.handleCreateOrUpdateMonthlyRevenue(
        formattedDateTimeString,
        invoice.totalPrice,
      );
    }

    await this.invoiceRepository.save(invoice);
  };
}
