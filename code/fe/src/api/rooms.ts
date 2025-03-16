import { Room } from "@/types/room.types";
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:3001",
});

// Get all rooms
export const getRooms = async () => {
  const response = await api.get("/api/rooms");
  return response.data;
};

// Create a new room
export const createRoom = async (newRoom: Partial<Room>) => {
  const response = await api.post("/room", newRoom);
  return response.data;
};

// Update room
export const updateRoom = async (id: number, updatedRoom: Partial<Room>) => {
  const response = await api.put(`/rooms/${id}`, updatedRoom);
  return response.data;
};

// Delete room
export const deleteRoom = async (id: string) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};

// Search room
export const searchRoom = async (searchValues: Partial<Room>) => {
  const response = await api.post("rooms/search", searchValues);
  return response.data;
};
