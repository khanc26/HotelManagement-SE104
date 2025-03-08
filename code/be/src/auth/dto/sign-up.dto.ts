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
import { UserTypeEnum } from 'src/users/enums/user-type.enum';

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
  readonly full_name: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly nationality: string;

  @IsDate()
  @Transform(({ value }) => new Date(value as string))
  readonly dob!: Date;

  @IsString()
  @IsNotEmpty()
  readonly phone_number!: string;

  @IsString()
  @IsNotEmpty()
  readonly address!: string;

  @IsString()
  @IsNotEmpty()
  readonly identity_number!: string;

  @IsEnum(UserTypeEnum)
  readonly user_type_name!: UserTypeEnum;
}
