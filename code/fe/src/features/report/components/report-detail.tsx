import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getReportById } from "@/api/reports";
import { TableSkeleton } from "@/components/table-skeleton";
import { TableError } from "@/components/table-error";
import { DataTable } from "@/components/ui/data-table";
import { useParams, useSearchParams } from "react-router";
import { reportDetailColumns } from "./report-detail-columns";

export function ReportDetail() {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const month = searchParams.get("month");

  const {
    data: report,
    isLoading: isLoading,
    isError: isError,
  } = useQuery({
    queryKey: ["report-detail", id],
    queryFn: () => getReportById(id!),
    enabled: !!id,
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>Report Revenue For {month} By Room Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <CardContent className="flex-1 w-1">
              {isLoading ? (
                <TableSkeleton />
              ) : isError ? (
                <TableError />
              ) : (
                <DataTable columns={reportDetailColumns} data={report || []} />
              )}
            </CardContent>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
