import { OverViewItem } from "@/components/layout/dashboard/overview-item";
import { Overview } from "@/features/dashboard/components/overview";
import { RecentSales } from "@/features/dashboard/components/recent-sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DashboardPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <OverViewItem title="Occupancy Rate" value="89%" gross={21} />

        <OverViewItem
          title="Average Daily Rate"
          value="1.000.000 vnđ"
          gross={21}
        />

        <OverViewItem
          title="Revenue Per Available Room"
          value="850.000 vnđ"
          gross={21}
        />

        <OverViewItem
          title="Total Revenue"
          value="100,000,000 vnđ"
          gross={21}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
