import { Type } from 'class-transformer';
import { CreateBookingDetailDto } from '../../booking-details/dto/create-booking-detail.dto';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingsStatus } from '../enums';

export class CreateBookingDto {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBookingDetailDto)
  bookingDetails!: CreateBookingDetailDto[];

  @ApiProperty()
  @IsEnum(BookingsStatus)
  @IsOptional()
  status?: BookingsStatus;
}
