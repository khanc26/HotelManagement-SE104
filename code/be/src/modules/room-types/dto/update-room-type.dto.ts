import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateRoomTypeDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly roomPrice?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly description?: string;
}
