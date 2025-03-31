import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateBookingDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  roomId!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  guestCount!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hasForeigners?: boolean;
}
