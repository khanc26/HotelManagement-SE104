import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @ApiProperty()
  @Length(6)
  password!: string;
}
