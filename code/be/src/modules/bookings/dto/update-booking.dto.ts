import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CreateParticipantDto } from './create-participant.dto';

export class UpdateBookingDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  roomId?: string;

  @ApiProperty({ type: [CreateParticipantDto] })
  @IsArray()
  @IsOptional()
  readonly participants?: CreateParticipantDto[];

  @ApiProperty()
  @IsDate()
  @IsOptional()
  readonly checkInDate?: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  readonly checkOutDate?: Date;
}
