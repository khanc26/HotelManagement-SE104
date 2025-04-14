import { Booking } from "./booking.type";
import { Invoice } from "./invoice.type";
import { Room } from "./room.type";

export enum BookingDetailsStatus {
  PENDING = "pending",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
}

export enum BookingDetailsApprovalStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export interface CreateBookingDetailRequest {
  roomId: string;
  guestCount: number;
  startDate: string;
  endDate: string;
  hasForeigners?: boolean;
}

export interface UpdateBookingDetailRequest {
  bookingDetailId: string;
  guestCount?: number;
  hasForeigners?: boolean;
  startDate?: Date;
  endDate?: Date;
  status?: BookingDetailsStatus;
  approvalStatus?: BookingDetailsApprovalStatus;
  roomId?: string;
}

export interface BookingDetail {
  id: string;
  guestCount: number;
  hasForeigners: boolean;
  startDate: Date;
  endDate: Date;
  status: BookingDetailsStatus;
  approvalStatus: BookingDetailsApprovalStatus;
  totalPrice: number;
  booking: Booking;
  room: Room;
  invoice?: Invoice;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
