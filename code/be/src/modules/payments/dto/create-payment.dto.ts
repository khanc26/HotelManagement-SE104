import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  readonly amount!: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly description?: string;

  @IsUUID()
  readonly invoiceId!: string;
}