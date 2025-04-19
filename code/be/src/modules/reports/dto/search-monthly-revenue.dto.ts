import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class SearchMonthlyRevenueDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly year?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value as string))
  readonly minRevenue?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value as string))
  readonly maxRevenue?: number;
}
