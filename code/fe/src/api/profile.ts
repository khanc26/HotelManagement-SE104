import { User } from "@/types/user.type";
import { createApiInstance } from "./axios-config";

const api = createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/auth`);

export const getMyProfile = async () => {
  try {
    const response = await api.get<User>(`/profile`);
    console.log("Response Data Profile:", response.data);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to get my profile");
  }
};