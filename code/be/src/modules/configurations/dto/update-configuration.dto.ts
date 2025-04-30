import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateConfigurationDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  configValue!: number;
}
