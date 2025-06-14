import { Booking, CreateBookingDto } from "@/types/booking.type";
import { createApiInstance } from "./axios-config";

const api = createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/bookings`);

export const createBooking = async (bookingData: CreateBookingDto) => {
  const response = await api.post("/", bookingData);
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
export const deleteBooking = async (id: string) => {
  const response = await api.delete<Booking>(`/${id}`);
  return response.data;
};

// Update a booking
// export const updateBooking = async (
//   id: string,
//   updatedBookingDetail: UpdateBookingDetailRequest
// ) => {
//   try {
//     const requestBody = {
//       updateBookingDetailDtos: [updatedBookingDetail],
//     };

//     const response = await api.patch(`/${id}`, requestBody);
//     return response.data;
//   } catch (error) {
//     throw error instanceof Error
//       ? error
//       : new Error("Failed to update booking");
//   }
// };