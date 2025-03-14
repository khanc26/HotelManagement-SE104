import axios from "axios";
import { User } from "@/types/user.type";

const api = axios.create({
  baseURL: "https://localhost:3001",
});

// Get all users
export const getUsers = async (access_token: string | null) => {
  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const userData: User[] = response.data;
  return userData;
};
