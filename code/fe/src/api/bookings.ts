import { UpdateBookingDetailRequest } from "@/types/booking-detail";
import { Booking } from "@/types/booking.type";
import { getAccessToken } from "@/utils/helpers/getAccessToken";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/bookings`,
});

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
  const access_token = getAccessToken();

  const requestBody: CreateBookingRequest = {
    createBookingDetailDtos: bookingDetails,
  };

  const response = await api.post("/", requestBody, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

// Get all bookings
export const getBookings = async () => {
  const access_token = getAccessToken();

  const response = await api.get<Booking[]>("/", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

// Get a single booking by ID
export const getBookingById = async (id: string) => {
  const access_token = getAccessToken();

  const response = await api.get<Booking>(`/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

// Delete a booking
export const deleteBookingDetail = async (
  id: string,
  bookingDetailIds: string[]
) => {
  const access_token = getAccessToken();

  const bookingDetailIdsString = bookingDetailIds.join(",");

  const response = await api.delete<Booking>(
    `/${id}?bookingDetailIds=${bookingDetailIdsString}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    }
  );

  return response.data;
};

// Update a booking
export const updateBooking = async (
  id: string,
  updatedBookingDetail: UpdateBookingDetailRequest
) => {
  try {
    const access_token = getAccessToken();

    const requestBody = {
      updateBookingDetailDtos: [updatedBookingDetail],
    };

    const response = await api.patch(`/${id}`, requestBody, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to update booking");
  }
};
