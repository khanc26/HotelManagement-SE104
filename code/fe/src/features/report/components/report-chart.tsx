import { MonthlyRevenue } from "@/types/report.type";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function ReportChart({ data }: { data: MonthlyRevenue[] }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Bar
          dataKey="totalRevenue"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
