export interface ReportRequest {
  year?: number;
  minRevenue?: number;
  maxRevenue?: number;
}

export interface MonthlyRevenueByRoomType {
  roomTypeName: string;
  revenue: number;
  percentage: string;
}

export interface MonthlyRevenue {
  id: string;
  month: string;
  totalRevenue: number;
  createAt: Date;
}
