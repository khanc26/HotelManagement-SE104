import { UpdateParamDto } from "@/types/configuration.";
import { getAccessToken } from "@/utils/helpers/getAccessToken";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/params`,
});


export const getConfiguration = async () => {
  try {
    const access_token = getAccessToken();

    const response = await api.get(`/`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    console.log("Response Configuration:", response.data);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to get configuration");
  }
};

export const updateConfiguration = async (
  paramName: string,
  updatedData: UpdateParamDto
) => {
  try {
    const access_token = getAccessToken();

    const response = await api.put(`${paramName}`, updatedData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update configuration');
    }
    throw new Error('Failed to update configuration');
  }
};

export const getConfigurationHistory = async () => {
  try {
    const access_token = getAccessToken();

    const response = await api.get(`/history`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      withCredentials: true,
    });

    console.log("Response Configuration History:", response.data);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error("Failed to get configuration history ");
  }
};