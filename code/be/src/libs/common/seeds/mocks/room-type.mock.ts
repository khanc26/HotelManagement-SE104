import {
  ROOM_A_PRICE,
  ROOM_B_PRICE,
  ROOM_C_PRICE,
} from 'src/libs/common/constants';
import { RoomTypeName } from 'src/modules/room-types/enums';

export const RoomTypeMock: Array<{
  name: RoomTypeName;
  description: string;
  roomPrice: number;
}> = [
  {
    name: RoomTypeName.A,
    description: 'Deluxe room with a beautiful city view.',
    roomPrice: ROOM_A_PRICE,
  },
  {
    name: RoomTypeName.B,
    description:
      'Spacious suite with modern amenities and a comfortable lounge area.',
    roomPrice: ROOM_B_PRICE,
  },
  {
    name: RoomTypeName.C,
    description:
      'Luxury room featuring a private balcony and premium furnishings.',
    roomPrice: ROOM_C_PRICE,
  },
];
