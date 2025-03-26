import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { UserTypeEnum } from 'src/modules/users/enums/user-type.enum';

export class SignUpDto {
  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  @Length(6)
  readonly password: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly fullName: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly nationality: string;

  @IsDate()
  @ApiProperty()
  @Transform(({ value }) => new Date(value as string))
  readonly dob!: Date;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly phoneNumber!: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly address!: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly identityNumber!: string;

  @ApiProperty()
  @IsEnum(UserTypeEnum)
  readonly userTypeName!: UserTypeEnum;
}
