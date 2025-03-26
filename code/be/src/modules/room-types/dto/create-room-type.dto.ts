import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { RoomTypeName } from 'src/modules/room-types/enums';

export class CreateRoomTypeDto {
  @IsEnum(RoomTypeName)
  @IsNotEmpty()
  readonly name!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly description?: string;

  @IsNumber()
  @IsPositive()
  readonly roomPrice!: number;
}
