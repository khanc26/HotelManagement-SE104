import { RoomType } from 'src/modules/room-types/entities';
import { setSeederFactory } from 'typeorm-extension';

export const RoomTypeFactory = setSeederFactory(RoomType, () => {
  return new RoomType();
});
