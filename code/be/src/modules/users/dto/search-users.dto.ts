import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProfileStatusEnum } from 'src/modules/users/enums/profile-status.enum';
import { RoleEnum } from 'src/modules/users/enums/role.enum';
import { UserTypeEnum } from 'src/modules/users/enums/user-type.enum';

export class SearchUsersDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly fullName?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  readonly roleName?: RoleEnum;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  readonly email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly nationality?: string;

  @IsOptional()
  @IsEnum(UserTypeEnum)
  @IsNotEmpty()
  readonly userTypeName: UserTypeEnum;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly identityNumber?: string;

  @IsOptional()
  @IsEnum(ProfileStatusEnum)
  @IsNotEmpty()
  readonly status?: ProfileStatusEnum;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly dob?: string;
}
