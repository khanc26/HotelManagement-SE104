import {
  MonthlyRevenue,
  MonthlyRevenueByRoomType,
  ReportRequest,
} from "@/types/report.type";
import { createApiInstance } from "./axios-config";

const api = createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/reports`);

export const getReports = async (query: ReportRequest) => {
  const response = await api.get<MonthlyRevenue[]>(`/`, {
    params: query,
  });
  return response.data;
};

export const getReportByMonth = async (month: string) => {
  const response = await api.get<MonthlyRevenueByRoomType[]>(`/${month}`);
  return response.data;
};
