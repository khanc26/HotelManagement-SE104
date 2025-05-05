import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateParamDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  paramValue!: number;
}
