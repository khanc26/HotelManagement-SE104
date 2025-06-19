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
  readonly fullName?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  readonly roleName?: RoleEnum;

  @IsOptional()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly nationality?: string;

  @IsOptional()
  @IsEnum(UserTypeEnum)
  readonly userTypeName?: UserTypeEnum;

  @IsOptional()
  @IsString()
  readonly identityNumber?: string;

  @IsOptional()
  @IsEnum(ProfileStatusEnum)
  readonly status?: ProfileStatusEnum;

  @IsOptional()
  @IsString()
  readonly dob?: string;
}
