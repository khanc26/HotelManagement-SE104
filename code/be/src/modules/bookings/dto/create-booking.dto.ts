import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateParticipantDto } from './create-participant.dto';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  roomId!: string;

  @ApiProperty({ type: [CreateParticipantDto] })
  @IsArray()
  @IsNotEmpty()
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
