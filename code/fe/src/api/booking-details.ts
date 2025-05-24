import { BookingDetail } from "@/types/booking-detail";
import { createApiInstance } from "./axios-config";
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3001/booking-details",
// });

const api = createApiInstance("http://localhost:3001/booking-details");

// Get booking details for a booking
export const getBookingDetailById = async (bookingDetailId: string) => {
  const response = await api.get<BookingDetail>(`/${bookingDetailId}`);
  return response.data;
};

// Get booking details for a booking
export const getBookingDetails = async () => {
  const response = await api.get<BookingDetail[]>(`/`);
  return response.data;
};
