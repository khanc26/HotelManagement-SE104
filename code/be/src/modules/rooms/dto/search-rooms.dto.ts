import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { RoomStatusEnum } from 'src/modules/rooms/enums/room-status.enum';

export class SearchRoomsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly roomNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly roomTypeName?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value as string))
  @IsNumber()
  @IsPositive()
  readonly price?: number;

  @IsOptional()
  @IsEnum(RoomStatusEnum)
  @IsNotEmpty()
  readonly status?: RoomStatusEnum;
}
