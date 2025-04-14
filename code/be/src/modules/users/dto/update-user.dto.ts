import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProfileStatusEnum } from 'src/modules/users/enums/profile-status.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly fullName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly nationality?: string;

  @IsOptional()
  @IsEnum(ProfileStatusEnum)
  @IsNotEmpty()
  readonly status?: ProfileStatusEnum;

  @IsOptional()
  @Transform(({ value }) => new Date(value as string))
  @IsDate()
  @IsNotEmpty()
  readonly dob?: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly identityNumber?: string;
}
