import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
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
  @IsDate()
  @Transform(({ value }) => {
    if (!value) return undefined;

    if (value instanceof Date) return value;

    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }

    return undefined;
  })
  readonly startDate!: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => {
    if (!value) return undefined;

    if (value instanceof Date) return value;

    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }

    return undefined;
  })
  readonly endDate!: Date;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly hasForeigners?: boolean;
}
