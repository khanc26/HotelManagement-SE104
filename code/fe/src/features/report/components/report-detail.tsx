import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getReportById } from "@/api/reports";
import { TableSkeleton } from "@/components/table-skeleton";
import { TableError } from "@/components/table-error";
import { DataTable } from "@/components/ui/data-table";
import { useParams, useSearchParams } from "react-router";
import { reportDetailColumns } from "./report-detail-columns";
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import { ReportDetailPDFDocument } from './report-detail-pdf-document';
// import { Button } from "@/components/ui/button";
// import { Printer } from 'lucide-react';

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Report Revenue For {month} By Room Type</CardTitle>
          {/* {report && month && (
            <PDFDownloadLink
              document={<ReportDetailPDFDocument reports={report} month={month} />}
              fileName={`revenue-report-${month.toLowerCase()}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" disabled={loading}>
                  <Printer className="mr-2 h-4 w-4" />
                  {loading ? 'Generating PDF...' : 'Print PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )} */}
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
