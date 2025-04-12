import { User, UserSearchRequest, UserUpdateRequest } from "@/types/user.type";
import { getAccessToken } from "@/utils/helpers/getAccessToken";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/users",
});

// Get all users
export const getUsers = async (params?: UserSearchRequest) => {
  const access_token = getAccessToken();

  console.log("Access Token:", access_token);

  const response = await api.get<User[]>("/", {
    params: {
      fullName: params?.fullName,
      roleName: params?.roleName,
      email: params?.email,
      address: params?.address,
      nationality: params?.nationality,
      userTypeName: params?.userTypeName,
      identifyNumber: params?.identifyNumber,
      status: params?.status,
      dob: params?.dob,

    },
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });
  
  return response.data;
};

export const deleteUser = async (id: string) => {
  const access_token = getAccessToken();

  const response = await api.delete<User>(`/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

export const updateUser = async (
  id: string,
  updatedUser: UserUpdateRequest
) => {
  try {
    const access_token = getAccessToken();

    const response = await api.patch<User>(`/${id}`, updatedUser, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update user");
  }
};