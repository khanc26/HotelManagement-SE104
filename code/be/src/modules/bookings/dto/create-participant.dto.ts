import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserTypeEnum } from 'src/modules/users/enums';

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

  @ApiProperty()
  @IsEnum(UserTypeEnum)
  readonly userType!: UserTypeEnum;
}
