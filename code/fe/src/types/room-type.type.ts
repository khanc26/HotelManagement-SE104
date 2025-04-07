import { Room } from "./room.type";

export enum RoomTypeName {
  A = "A",
  B = "B",
  C = "C",
}

export interface RoomType {
  id: string;
  name: RoomTypeName;
  description?: string;
  roomPrice: number;
  maxGuests?: number;
  rooms?: Room[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
