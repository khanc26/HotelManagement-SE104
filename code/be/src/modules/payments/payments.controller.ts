import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/libs/common/decorators';
import { VnpParamsType } from 'src/libs/common/types';
import { CreatePaymentDto } from 'src/modules/payments/dto';
import { RoleEnum } from 'src/modules/users/enums';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
  async getPayments() {
    return this.paymentsService.getPayments();
  }

  @Post()
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() request: Request,
  ) {
    const clientIp = request.ip ?? '::1';

    return this.paymentsService.createPaymentUrl(createPaymentDto, clientIp);
  }

  @Get('vnpay/ipn')
  async handleVpnIpn(@Query() query: VnpParamsType) {
    await this.paymentsService.handleUpdateStatusPayment(
      query['vnp_TxnRef'],
      query['vnp_ResponseCode'],
      query['vnp_TransactionStatus'],
    );

    return { RspCode: '00', Message: 'Success' };
  }

  @Get(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  async getPayment(@Param('id', ParseUUIDPipe) id: string) {}
}
