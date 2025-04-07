import { IsNumber, IsPositive } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  @IsPositive()
  readonly basePrice!: number;

  @IsNumber()
  @IsPositive()
  readonly totalPrice!: number;

  @IsNumber()
  @IsPositive()
  readonly dayRent!: number;
}
