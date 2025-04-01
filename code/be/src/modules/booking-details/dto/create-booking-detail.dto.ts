import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateBookingDetailDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly roomId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  readonly guestCount!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsISO8601()
  readonly startDate!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsISO8601()
  readonly endDate!: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly hasForeigners?: boolean;
}
