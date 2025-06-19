export enum InvoicesStatus {
  PAID = "paid",
  UNPAID = "unpaid",
  CANCELLED = "cancelled",
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
  booking: {
    id: string;
    totalPrice: number;
    checkInDate: string;
    checkOutDate: string;
    user: {
      id: string;
      email: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    };
    room: {
      id: string;
      roomNumber: string;
      note: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    };
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
