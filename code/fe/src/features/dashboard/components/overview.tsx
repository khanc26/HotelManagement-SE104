import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    month: "Jan",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "Feb",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "Mar",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "Apr",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "May",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "Jun",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "Jul",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "Aug",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "Sep",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "Oct",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "Nov",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    month: "Dec",
    totalRevenue: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function Overview() {
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
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
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
