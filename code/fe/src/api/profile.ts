import { User } from "@/types/user.type";
import { getAccessToken } from "@/utils/helpers/getAccessToken";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/auth",
});

export const getMyProfile = async () => {
  try {
    const access_token = getAccessToken();

    const response = await api.get<User>(`/profile`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    console.log("Response Data Profile:", response.data);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to get my profile");
  }
};