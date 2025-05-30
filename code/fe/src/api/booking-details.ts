import { BookingDetail } from "@/types/booking-detail";
import { createApiInstance } from "./axios-config";

const api = createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/booking-details`);

export const getBookingDetailById = async (bookingDetailId: string) => {
  const response = await api.get<BookingDetail>(`/${bookingDetailId}`);
  return response.data;
};

export const getBookingDetails = async () => {
  const response = await api.get<BookingDetail[]>(`/`);
  return response.data;
};
