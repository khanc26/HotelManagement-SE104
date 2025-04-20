import {
  Room,
  RoomCreateRequest,
  RoomRequest,
  RoomUpdateRequest,
} from "@/types/room.type";
import { getAccessToken } from "@/utils/helpers/getAccessToken";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/rooms",
});

// Get all rooms with optional query parameters
export const getRooms = async (params?: RoomRequest) => {
  const access_token = getAccessToken();

  console.log("Params:", params);

  const response = await api.get<Room[]>("/", {
    params: {
      roomNumber: params?.roomNumber,
      roomTypeName: params?.roomType,
      price: params?.price,
      status: params?.status,
    },
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

// Get a single room by ID
export const getRoom = async (id: string) => {
  const access_token = getAccessToken();

  const response = await api.get<Room>(`/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

// Create a new room
export const createRoom = async (newRoom: RoomCreateRequest) => {
  try {
    const access_token = getAccessToken();

    const response = await api.post<Room>("/", newRoom, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update room");
  }
};

// Update an existing room
export const updateRoom = async (
  id: string,
  updatedRoom: RoomUpdateRequest
) => {
  try {
    const access_token = getAccessToken();

    const response = await api.patch<Room>(`/${id}`, updatedRoom, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update room");
  }
};

// Delete a room
export const deleteRoom = async (id: string) => {
  const access_token = getAccessToken();

  const response = await api.delete<Room>(`/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};
