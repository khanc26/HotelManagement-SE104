import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateParticipantDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly fullName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly address!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly identityNumber!: string;
}
