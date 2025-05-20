import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly token!: string;

  @IsString()
  @IsNotEmpty()
  readonly newPassword!: string;
}
