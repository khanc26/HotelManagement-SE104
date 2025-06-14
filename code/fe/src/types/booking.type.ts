import { Room } from "./room.type";
import { User, UserType } from "./user.type";

export interface Participant {
  email: string;
  fullName: string;
  address: string;
  identityNumber: string;
  userType: UserType;
}

export interface Booking {
  id: string;
  room: Room;
  checkInDate: Date;
  checkOutDate: Date;
  user: User;
  participants: Participant[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateBookingDto {
  roomId: string;
  participants: Participant[];
  checkInDate: Date;
  checkOutDate: Date;
}

export interface UpdateBookingDto {
  roomId?: string;
  participants?: Participant[];
  checkInDate?: Date | string;
  checkOutDate?: Date | string;
}
