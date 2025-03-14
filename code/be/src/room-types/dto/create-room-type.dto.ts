import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { RoomTypeName } from 'src/room-types/enums/room-type-name.enum';

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
