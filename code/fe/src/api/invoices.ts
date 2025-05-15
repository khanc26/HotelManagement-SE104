import { Invoice } from "@/types/invoice.type";
import { getAccessToken } from "@/utils/helpers/getAccessToken";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/invoices`,
});

export const getInvoices = async () => {
  const access_token = getAccessToken();

  const response = await api.get<Invoice[]>(`/`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

export const getInvoiceById = async (id: string) => {
  const access_token = getAccessToken();

  const response = await api.get<Invoice>(`/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};

export const deleteInvoice = async (id: string) => {
  const access_token = getAccessToken();

  const response = await api.delete<Invoice>(`/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};