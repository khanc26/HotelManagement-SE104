import axios from "axios";
import { User } from "@/types/user.type";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Get all users
export const getUsers = async () => {
  let access_token = localStorage.getItem("access_token");

  access_token = access_token?.replace(/^"|"$/g, "").trim() || null;

  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });
  
  const userData: User[] = response.data;
  return userData;
};
