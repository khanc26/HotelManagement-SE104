import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import {
  CreateBookingDetailDto,
  UpdateBookingDetailDto,
} from 'src/modules/booking-details/dto';

export class UpdateBookingDto {
  @ApiProperty({ type: [UpdateBookingDetailDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingDetailDto)
  readonly updateBookingDetailDtos!: UpdateBookingDetailDto[];
}
