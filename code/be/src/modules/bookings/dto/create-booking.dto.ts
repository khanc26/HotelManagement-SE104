import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateParticipantDto } from './create-participant.dto';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  roomId!: string;

  @ApiProperty({ type: [CreateParticipantDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateParticipantDto)
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  readonly participants!: CreateParticipantDto[];

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => new Date(value))
  readonly checkInDate!: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => new Date(value))
  readonly checkOutDate!: Date;
}
