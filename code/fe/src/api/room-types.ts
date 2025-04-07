import { getAccessToken } from "@/utils/helpers/getAccessToken";
import axios from "axios";
import { RoomType } from "@/types/room-type.type";

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
