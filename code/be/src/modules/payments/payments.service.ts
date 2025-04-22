import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { ProductCode, VnpCurrCode, VnpLocale } from 'vnpay';

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) {}

  public createPaymentUrl = (orderInfo: any) => {
    const params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.configService.get<string>('vnpay.tmn_code'),
      vnp_Amount: orderInfo.amount * 100,
      vnp_OrderInfo: orderInfo.description,
      vnp_CurrCode: VnpCurrCode.VND,
      vnp_ReturnUrl:
        'https://hotel-management-se-104-fe.vercel.app/payment-result',
      vnp_IpAddr: orderInfo.ipAddress,
      vnp_TxnRef: orderInfo.id.toString(),
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
    const secret = '5RWE5SDRM6I8Z0F1QWKJC4SDLE0UW0LO';
    const hmac = crypto.createHmac('sha512', secret);
    const secureHash = hmac
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${signData}&vnp_SecureHash=${secureHash}`;

    return { paymentUrl };
  };
}
