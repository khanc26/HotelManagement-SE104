import { BookingDetail } from "./booking-detail";

export enum InvoicesStatus {
  UNPAID = "unpaid",
  PAID = "paid",
  CANCELLED = "cancelled", // Giả định thêm trạng thái hợp lý
}

export interface CreateInvoiceRequest {
  basePrice: number;
  totalPrice: number;
  dayRent: number;
}

export interface UpdateInvoiceReuest {
  basePrice?: number;
  totalPrice?: number;
  dayRent?: number;
  status?: InvoicesStatus;
}

export interface Invoice {
  id: string;
  basePrice: number;
  totalPrice: number;
  dayRent: number;
  status: InvoicesStatus;
  bookingDetail: BookingDetail;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
