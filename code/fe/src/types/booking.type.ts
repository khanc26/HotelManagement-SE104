import { Invoice } from "./invoice.type";
import { Room } from "./room.type";
import { User, UserType } from "./user.type";

export interface Participant {
  email: string;
  fullName: string;
  address: string;
  identityNumber: string;
  userType: UserType;
}

export interface ParticipantResponse {
  id: string;
  email: string;
  profile: {
    id: string;
    fullName: string;
    nationality: string | null;
    status: "active" | "inactive";
    dob: string | Date | null;
    phoneNumber: string | null;
    address: string;
    identityNumber: string;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Booking {
  id: string;
  room: Room;
  checkInDate: Date;
  checkOutDate: Date;
  user: User;
  participants: ParticipantResponse[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  invoice: Invoice
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
