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
  @Transform(({ value }) => new Date(value as string))
  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  readonly startDate?: Date;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => new Date(value as string))
  @IsDate()
  @Transform(({ value }) => new Date(value as string))
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
