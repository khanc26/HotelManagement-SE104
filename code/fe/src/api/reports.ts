import {
  MonthlyRevenue,
  MonthlyRevenueByRoomType,
  ReportRequest,
} from "@/types/report.type";
import { createApiInstance } from "./axios-config";

const api = createApiInstance("http://localhost:3001/reports");

export const getReports = async (query: ReportRequest) => {
  const response = await api.get<MonthlyRevenue[]>(`/`, {
    params: query,
  });
  return response.data;
};

export const getReportById = async (id: string) => {
  const response = await api.get<MonthlyRevenueByRoomType[]>(`/${id}`);
  return response.data;
};
