import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { omit } from 'lodash';
import { BookingsService } from 'src/modules/bookings/bookings.service';
import { Invoice } from 'src/modules/invoices/entities';
import { InvoicesService } from 'src/modules/invoices/invoices.service';
import { CreatePaymentDto } from 'src/modules/payments/dto';
import { Payment } from 'src/modules/payments/entities';
import { PaymentStatus } from 'src/modules/payments/enums';
import { Repository } from 'typeorm';
import { ProductCode, VnpCurrCode, VnpLocale } from 'vnpay';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly invoicesService: InvoicesService,
    private readonly bookingsService: BookingsService,
  ) {}
  public getPayments = async (userId: string) => {
    const allPayments = await this.paymentRepository.find({
      relations: {
        invoice: {
          booking: true,
        },
      },
    });

    return Promise.all(
      allPayments.map(async (payment) =>
        this.getFormattedPayment(payment, userId),
      ),
    );
  };

  public getPayment = async (id: string, userId: string) => {
    const payment = await this.paymentRepository.findOne({
      where: {
        id,
      },
      relations: {
        invoice: {
          booking: {
            user: true,
          },
        },
      },
    });

    if (!payment) throw new NotFoundException(`Payment not found.`);

    return this.getFormattedPayment(payment, userId);
  };

  public createPaymentUrl = async (
    createPaymentDto: CreatePaymentDto,
    clientIp: string,
  ) => {
    const { amount, invoiceId, description } = createPaymentDto;
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id: invoiceId,
      },
    });
    if (!invoice) throw new NotFoundException(`Invoice not found.`);
    const newPayment = this.paymentRepository.create({
      amount,
    });
    newPayment.invoice = invoice;
    await this.paymentRepository.save(newPayment);
    const params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.configService.get<string>('vnpay.tmn_code', ''),
      vnp_Amount: amount * 100,
      vnp_OrderInfo: description
        ? description
        : `Payment request for invoice '${invoiceId}'`,
      vnp_CurrCode: VnpCurrCode.VND,
      vnp_ReturnUrl: this.configService.get<string>('vnpay.return_url', ''),
      vnp_IpAddr: clientIp,
      vnp_TxnRef: invoiceId,
      vnp_Locale: VnpLocale.VN,
      vnp_OrderType: ProductCode.CardCode,
      vnp_CreateDate: new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14),
    };
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
    const signData = new URLSearchParams(sortedParams).toString();
    const secret = this.configService.get<string>('vnpay.secure_secret', '');
    const hmac = crypto.createHmac('sha512', secret);
    const secureHash = hmac
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');
    const paymentUrl = `${this.configService.get<string>('vnpay.host', '')}?${signData}&vnp_SecureHash=${secureHash}`;
    return { paymentUrl };
  };

  public handleUpdateStatusPayment = async (
    invoiceId: string,
    vnp_ResponseCode: string,
    vnp_TransactionStatus: string,
  ) => {
    // await this.invoicesService.handleUpdateStatusOfInvoice(
    //   invoiceId,
    //   vnp_ResponseCode,
    //   vnp_TransactionStatus,
    // );

    const payment = await this.paymentRepository.findOne({
      where: {
        invoice: {
          id: invoiceId,
        },
      },
      relations: {
        invoice: true,
      },
    });

    if (!payment)
      throw new NotFoundException(`Payment of this invoice not found.`);

    payment.payment_status =
      vnp_ResponseCode === '00' && vnp_TransactionStatus == '00'
        ? PaymentStatus.PAID
        : PaymentStatus.UNPAID;

    await this.paymentRepository.save(payment);
  };

  private getFormattedPayment = async (payment: Payment, userId: string) => {
    return {
      ...omit(payment, ['invoice.booking']),
      invoice: {
        ...payment.invoice,
        booking: await this.bookingsService.findOne(
          payment.invoice.booking.id,
          userId,
        ),
      },
    };
  };
}
