import { BookingDetail } from "./booking-detail";
import { User } from "./user.type";

export interface Booking {
  id: string;
  totalPrice: number;
  user: User;
  bookingDetails: BookingDetail[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
