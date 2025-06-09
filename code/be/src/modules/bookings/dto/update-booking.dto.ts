import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEmail, IsOptional } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

const toDate = ({ value }: TransformFnParams) => {
  if (!value) return null;
  return new Date(value);
};

export class UpdateBookingDto {
  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  readonly emails?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Transform(toDate)
  readonly checkInDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Transform(toDate)
  readonly checkOutDate?: Date;
}
