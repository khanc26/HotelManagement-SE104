import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class CheckParticipantsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  readonly emails!: string[];
}