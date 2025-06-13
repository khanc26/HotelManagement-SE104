import { User, UserSearchRequest, UserUpdateRequest } from "@/types/user.type";
import { createApiInstance } from "./axios-config";

const api = createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/users`);

// Get all users
export const getUsers = async (params?: UserSearchRequest) => {
  console.log("Access Token:", localStorage.getItem("access_token"));

  const response = await api.get<User[]>("/", {
    params: {
      fullName: params?.fullName,
      roleName: params?.roleName,
      email: params?.email,
      address: params?.address,
      nationality: params?.nationality,
      userTypeName: params?.userTypeName,
      identityNumber: params?.identityNumber,
      status: params?.status,
      dob: params?.dob,
    },
  });
  
  console.log("Response Data User:", response.data);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete<User>(`/${id}`);
  return response.data;
};

export const updateUser = async (
  id: string,
  updatedUser: UserUpdateRequest
) => {
  try {
    const response = await api.patch<User>(`/${id}`, updatedUser);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to update user");
  }
};