import {  getReportByMonth } from "@/api/reports";
import { TableError } from "@/components/table-error";
import { TableSkeleton } from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { format, parse } from "date-fns";
import { Printer } from "lucide-react";
import { useParams } from "react-router";
import { reportDetailColumns } from "./report-detail-columns";
import { ReportDetailPDFDocument } from "./report-detail-pdf-document";

export function ReportDetail() {
  const { id } = useParams();

  const {
    data: report,
    isLoading: isLoading,
    isError: isError,
  } = useQuery({
    queryKey: ["report-detail", id],
    queryFn: () => getReportByMonth(id!),
    enabled: !!id,
  });

  const formattedDate = format(
    parse(`${id}-01`, "yyyy-MM-dd", new Date()),
    "MMMM yyyy"
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <Card className="w-full mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-medium">
            Revenue by Room Type - {formattedDate}
          </CardTitle>
          {report && id && (
            <PDFDownloadLink
              key={Date.now()}
              document={
                <ReportDetailPDFDocument
                  reports={report}
                  month={formattedDate}
                />
              }
              fileName={`revenue-report-${id.toLowerCase()}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" disabled={loading}>
                  <Printer className="mr-2 h-4 w-4" />
                  {loading ? "Generating PDF..." : "Print PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          )}
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
