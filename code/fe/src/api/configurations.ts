import { UpdateParamDto } from "@/types/configuration.";
import { createApiInstance } from "./axios-config";

const api = createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/params`);

export const getConfiguration = async () => {
  const response = await api.get(`/`);
  return response.data;
};

export const updateConfiguration = async (
  paramName: string,
  updatedData: UpdateParamDto
) => {
  const response = await api.put(`/${paramName}`, updatedData);
  return response.data;
};

export const getConfigurationHistory = async () => {
  const response = await api.get(`/history`);
  return response.data;
};