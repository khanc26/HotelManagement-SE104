import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { RoomStatusEnum } from 'src/modules/rooms/enums/room-status.enum';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly roomNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly note?: string;

  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  readonly roomTypeId?: string;

  @IsOptional()
  @IsEnum(RoomStatusEnum)
  @IsNotEmpty()
  readonly status?: RoomStatusEnum;
}
