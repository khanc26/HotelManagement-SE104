import { faker } from '@faker-js/faker';
import { RoomType } from 'src/modules/room-types/entities';
import { Repository } from 'typeorm';

export const generateRoomsMockData = async (
  roomTypeRepository: Repository<RoomType>,
) => {
  const roomTypes = await roomTypeRepository.find();

  if (!roomTypes || roomTypes.length === 0)
    throw new Error('No room types available in the database.');

  const locations = [
    'near elevator',
    'near window',
    'near stairs',
    'quiet area',
    'close to restaurant',
  ];

  const fakeRooms = Array.from({ length: 50 }, () => {
    let roomCode: string;
    let roomType: RoomType;
    let floor: number;

    do {
      roomType = faker.helpers.arrayElement<RoomType>(roomTypes);

      floor = faker.number.int({ min: 1, max: 10 });

      const roomNumber = faker.number.int({ min: 1, max: 20 });

      roomCode = `${roomType.name}-${floor}${String(roomNumber).padStart(2, '0')}`;
    } while (!roomCode.startsWith(roomType.name));

    const note = `Type ${roomType.name} room, ${faker.helpers.arrayElement(locations)} on ${floor} floor`;

    return {
      roomNumber: roomCode,
      note,
      roomTypeId: roomType.id,
    };
  });

  return fakeRooms;
};
