import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  readonly email!: string;

  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  readonly otp!: string;
}
