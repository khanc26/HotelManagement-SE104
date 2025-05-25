import { Invoice } from "@/types/invoice.type";
import { createApiInstance } from "./axios-config";

const api = createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/invoices`);

export const getInvoices = async () => {
  const response = await api.get<Invoice[]>(`/`);
  return response.data;
};

export const getInvoiceById = async (id: string) => {
  const response = await api.get<Invoice>(`/${id}`);
  return response.data;
};

export const deleteInvoice = async (id: string) => {
  const response = await api.delete<Invoice>(`/${id}`);
  return response.data;
};