import { getAccessToken } from "@/utils/helpers/getAccessToken";
import axios from "axios";
import { RoomType } from "@/types/room-type.type";
import { RoomTypeCreateRequest, RoomTypeUpdateRequest } from "@/types/room-type.type";
const api = axios.create({
  baseURL: "http://localhost:3001/room-types",
});

export const getRoomTypes = async (): Promise<RoomType[]> => {
  const access_token = getAccessToken();

  const response = await api.get<RoomType[]>("/", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};
// Get a single room type by ID
export const getRoomType = async (id: string): Promise<RoomType> => {
  const access_token = getAccessToken();

  const response = await api.get<RoomType>(`/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

// Create a new room type
export const createRoomType = async (newRoomType: RoomTypeCreateRequest): Promise<RoomType> => {
  try {
    const access_token = getAccessToken();

    const response = await api.post<RoomType>("/", newRoomType, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to create room type");
  }
};

// Update an existing room type
export const updateRoomType = async (
  id: string,
  updatedRoomType: RoomTypeUpdateRequest
): Promise<RoomType> => {
  try {
    const access_token = getAccessToken();

    const response = await api.patch<RoomType>(`/${id}`, updatedRoomType, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update room type");
  }
};

// Delete a room type
export const deleteRoomType = async (id: string): Promise<RoomType> => {
  const access_token = getAccessToken();

  const response = await api.delete<RoomType>(`/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};