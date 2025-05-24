import {
  Room,
  RoomCreateRequest,
  RoomRequest,
  RoomUpdateRequest,
} from "@/types/room.type";
import { createApiInstance } from "./axios-config";

const api = createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/rooms`);

// Get all rooms with optional query parameters
export const getRooms = async (params?: RoomRequest) => {
  console.log("Params:", params);

  const response = await api.get<Room[]>("/", {
    params: {
      roomNumber: params?.roomNumber,
      roomTypeName: params?.roomType,
      price: params?.price,
      status: params?.status,
    },
  });

  return response.data;
};

// Get a single room by ID
export const getRoom = async (id: string) => {
  const response = await api.get<Room>(`/${id}`);
  return response.data;
};

// Create a new room
export const createRoom = async (newRoom: RoomCreateRequest) => {
  try {
    const response = await api.post<Room>("/", newRoom);
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
    const response = await api.patch<Room>(`/${id}`, updatedRoom);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update room");
  }
};

// Delete a room
export const deleteRoom = async (id: string) => {
  const response = await api.delete<Room>(`/${id}`);
  return response.data;
};
