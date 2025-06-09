import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

const toDate = ({ value }: TransformFnParams) => {
  if (!value) return null;
  return new Date(value);
};

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  roomId!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  readonly emails!: string[];

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Transform(toDate)
  readonly checkInDate!: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Transform(toDate)
  readonly checkOutDate!: Date;
}
