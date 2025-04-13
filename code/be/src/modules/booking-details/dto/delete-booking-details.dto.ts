import { IsArray, ArrayNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class DeleteBookingDetailsDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return (value as string[]).map((v) => v.trim()).filter((v) => !!v);
    }

    if (typeof value === 'string') {
      return value.includes(',')
        ? value
            .split(',')
            .map((v) => v.trim())
            .filter((v) => !!v)
        : [value.trim()];
    }

    return [];
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  bookingDetailIds!: string[];
}
