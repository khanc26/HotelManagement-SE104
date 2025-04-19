import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  BookingDetailsApprovalStatus,
  BookingDetailsStatus,
} from 'src/modules/booking-details/enums';

export class UpdateBookingDetailDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  readonly bookingDetailId!: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly guestCount?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly hasForeigners?: boolean;

  @ApiProperty()
  @IsOptional()
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
  readonly startDate?: Date;

  @ApiProperty()
  @IsOptional()
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
  readonly endDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsEnum(BookingDetailsStatus)
  @IsNotEmpty()
  readonly status?: BookingDetailsStatus;

  @ApiProperty()
  @IsOptional()
  @IsEnum(BookingDetailsApprovalStatus)
  @IsNotEmpty()
  readonly approvalStatus?: BookingDetailsApprovalStatus;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  readonly roomId?: string;
}
