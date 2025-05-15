import {
  MonthlyRevenue,
  MonthlyRevenueByRoomType,
  ReportRequest,
} from "@/types/report.type";
import { getAccessToken } from "@/utils/helpers/getAccessToken";
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/reports`,
});

export const getReports = async (query: ReportRequest) => {
  const access_token = getAccessToken();

  const response = await api.get<MonthlyRevenue[]>(`/`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
    params: query,
  });

  return response.data;
};

export const getReportById = async (id: string) => {
  const access_token = getAccessToken();

  const response = await api.get<MonthlyRevenueByRoomType[]>(`/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    withCredentials: true,
  });

  return response.data;
};
