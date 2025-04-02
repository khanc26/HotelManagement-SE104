import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(() => Date)
  readonly startDate?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
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
