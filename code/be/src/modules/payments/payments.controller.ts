import { Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment() {
    return this.paymentsService.createPaymentUrl({
      amount: 100000,
      description: 'Hello World',
      ipAddress: 'dadadasd22222',
      id: 'id-222222dadasda2',
    });
  }
}
