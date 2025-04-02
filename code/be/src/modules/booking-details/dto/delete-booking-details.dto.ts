import { IsArray, ArrayNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeleteBookingDetailsDto {
  @IsOptional()
  @Transform(({ value }) => (value as string).split(','))
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  bookingDetailIds!: string[];
}
