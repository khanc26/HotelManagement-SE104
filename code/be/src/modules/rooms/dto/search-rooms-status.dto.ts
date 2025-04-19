import { IsEnum } from 'class-validator';
import { RoomStatusEnum } from 'src/modules/rooms/enums';

export class SearchStatusRoomsDto {
  @IsEnum(RoomStatusEnum)
  readonly status!: RoomStatusEnum;
}
