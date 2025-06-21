import { RecentSales } from "@/features/dashboard/components/recent-sales";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/api/reports";
import { TableSkeleton } from "@/components/table-skeleton";
import { TableError } from "@/components/table-error";
import { ReportChart } from "@/features/report/components/report-chart";
import { getInvoices } from "@/api/invoices";

const DashboardPage = () => {
  const {
    data: reportList,
    isLoading: isLoadingReport,
    isError: isErrorReport,
  } = useQuery({
    queryKey: ["report-list"],
    queryFn: () => getReports({}),
  });

  const {
      data: invoices,
      isLoading: isLoadingSale,
      isError: isErrorSale,
    } = useQuery({
      queryKey: ["invoices"],
      queryFn: getInvoices,
    });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoadingReport ? (
              <TableSkeleton />
            ) : isErrorReport ? (
              <TableError />
            ) : (
              <ReportChart data={reportList!} />
            )}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSale ? (
              <TableSkeleton />
            ) : isErrorSale ? (
              <TableError />
            ) : (
              <RecentSales invoices={invoices!} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
