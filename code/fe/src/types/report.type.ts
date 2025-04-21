export interface ReportRequest {
  year?: number;
  minRevenue?: number;
  maxRevenue?: number;
}

export interface MonthlyRevenueByRoomType {
  roomType: string;
  revenue: number;
  percent: string;
}

export interface MonthlyRevenue {
  id: string;
  month: string;
  totalRevenue: number;
  createAt: Date;
}
