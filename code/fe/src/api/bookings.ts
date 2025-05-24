import { UpdateBookingDetailRequest } from "@/types/booking-detail";
import { Booking } from "@/types/booking.type";
import { createApiInstance } from "./axios-config";

const api = createApiInstance("http://localhost:3001/bookings");

interface CreateBookingDetailDto {
  roomId: string;
  guestCount: number;
  startDate: string;
  endDate: string;
  hasForeigners: boolean;
}

interface CreateBookingRequest {
  createBookingDetailDtos: CreateBookingDetailDto[];
}

export const createBooking = async (bookingDetails: CreateBookingDetailDto[]) => {
  const requestBody: CreateBookingRequest = {
    createBookingDetailDtos: bookingDetails,
  };

  const response = await api.post("/", requestBody);
  return response.data;
};

// Get all bookings
export const getBookings = async () => {
  const response = await api.get<Booking[]>("/");
  return response.data;
};

// Get a single booking by ID
export const getBookingById = async (id: string) => {
  const response = await api.get<Booking>(`/${id}`);
  return response.data;
};

// Delete a booking
export const deleteBookingDetail = async (
  id: string,
  bookingDetailIds: string[]
) => {
  const bookingDetailIdsString = bookingDetailIds.join(",");
  const response = await api.delete<Booking>(
    `/${id}?bookingDetailIds=${bookingDetailIdsString}`
  );
  return response.data;
};

// Update a booking
export const updateBooking = async (
  id: string,
  updatedBookingDetail: UpdateBookingDetailRequest
) => {
  try {
    const requestBody = {
      updateBookingDetailDtos: [updatedBookingDetail],
    };

    const response = await api.patch(`/${id}`, requestBody);
    return response.data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to update booking");
  }
};
