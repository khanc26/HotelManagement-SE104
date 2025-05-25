import { createApiInstance } from "./axios-config";

const api = createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/payments`);

export const payInvoice = async (invoiceId: string, amount: number) => {
  const response = await api.post(`/`, {
    amount,
    invoiceId,
  });
  return response.data;
};