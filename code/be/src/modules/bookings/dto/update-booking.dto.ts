import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsUUID } from 'class-validator';
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
  @Transform(({ value }: { value: string }) => new Date(value))
  readonly checkInDate?: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Transform(({ value }: { value: string }) => new Date(value))
  readonly checkOutDate?: Date;
}
