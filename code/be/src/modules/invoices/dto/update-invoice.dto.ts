import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { InvoicesStatus } from 'src/modules/invoices/enums';

export class UpdateInvoiceDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly basePrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly dayRent?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly totalPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(InvoicesStatus)
  readonly status?: InvoicesStatus;
}
