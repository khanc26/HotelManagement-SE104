import { RoomType } from "./room-type.type";

export interface Room {
  id: string;
  roomNumber: string;
  note?: string;
  status: "available" | "occupied"; // adjust based on your enum
  roomType: RoomType;
  createdAt: string; // or Date if you parse it
  updatedAt: string;
  deletedAt?: string | null;
}

export interface RoomRequest {
  roomNumber?: string;
  roomType?: string;
  price?: number;
  maxGuests?: number;
  note?: string;
  status?: "available" | "occupied";
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface RoomUpdateRequest {
  roomNumber?: string;
  roomTypeId: string;
  note?: string;
  status?: "available" | "occupied";
}

export interface RoomCreateRequest {
  roomNumber: string;
  roomTypeId: string;
  note?: string;
}
