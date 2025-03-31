import { ApiProperty } from '@nestjs/swagger';
import { BookingsStatus } from '../enums';
import { IsOptional } from 'class-validator';

export class UpdateBookingDto {
  @ApiProperty()
  @IsOptional()
  status?: BookingsStatus;
}
