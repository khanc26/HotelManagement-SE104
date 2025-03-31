import { IsOptional, IsUUID } from 'class-validator';
import { CreateBookingDetailDto } from './create-booking-detail.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateBookingDetailDto extends PartialType(
  CreateBookingDetailDto,
) {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  bookingId!: string;
}
