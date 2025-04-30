import { BookingDetail } from "@/types/booking-detail";
import { getAccessToken } from "@/utils/helpers/getAccessToken";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/booking-details`,
});

// Get booking details for a booking
export const getBookingDetailById = async (bookingDetailId: string) => {
  const access_token = getAccessToken();

  const response = await api.get<BookingDetail>(`/${bookingDetailId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

// Get booking details for a booking
export const getBookingDetails = async () => {
  const access_token = getAccessToken();

  const response = await api.get<BookingDetail[]>(`/`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};
