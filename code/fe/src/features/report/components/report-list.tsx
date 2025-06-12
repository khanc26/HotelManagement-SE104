import { getReports } from "@/api/reports";
import { TableError } from "@/components/table-error";
import { TableSkeleton } from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReportRequest } from "@/types/report.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReportChart } from "./report-chart";
import { reportColumns } from "./report-columns";
import { ReportListPDFDocument } from "./report-list-pdf-document";

const reportSearchSchema = z.object({
  year: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Year must be a positive number",
    }),
  minRevenue: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Minimum revenue must be a positive number",
    }),
  maxRevenue: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Maximum revenue must be a positive number",
    }),
});
export function ReportList() {
  const [searchParams, setSearchParams] = useState<ReportRequest>({});

  const form = useForm<z.infer<typeof reportSearchSchema>>({
    resolver: zodResolver(reportSearchSchema),
    defaultValues: {
      year: "",
      minRevenue: "",
      maxRevenue: "",
    },
  });

  const {
    data: reportList,
    isLoading: isLoading,
    isError: isError,
  } = useQuery({
    queryKey: ["report-list", searchParams],
    queryFn: () => getReports(searchParams),
    enabled: !!searchParams,
  });

  const onSearch = (values: z.infer<typeof reportSearchSchema>) => {
    const searchRequest: ReportRequest = {
      year: values.year ? Number(values.year) : undefined,
      minRevenue: values.minRevenue ? Number(values.minRevenue) : undefined,
      maxRevenue: values.maxRevenue ? Number(values.maxRevenue) : undefined,
    };
  
    setSearchParams((prev) => ({
      ...prev,
      ...searchRequest,
    }));
  };
  

  const clearFilters = () => {
    form.reset({
      year: "",
      minRevenue: "",
      maxRevenue: "",
    });
    setSearchParams({});
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Report Search Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Report by year..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Return the report in specific year.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum revenue</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Minimum revenue..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Only show the months that have revenue greater than
                        this.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Revenue</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Maximum Revenue"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Only show the months that have revenue less than this.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Table Data */}
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Report Chart</CardTitle>
        </CardHeader>
        <div className="flex">
          <CardContent className="flex-1 w-1">
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <TableError />
            ) : (
              <ReportChart data={reportList!} />
            )}
          </CardContent>
        </div>
      </Card>

      {/* Table Data */}
      <Card className="w-full mb-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Revenue Report Each Month
          </CardTitle>
          {reportList && (
            <PDFDownloadLink
              key={Date.now()}
              document={<ReportListPDFDocument reports={reportList} />}
              fileName="monthly-revenue-report.pdf"
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
        <div className="flex">
          <CardContent className="flex-1 w-1">
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <TableError />
            ) : (
              <DataTable columns={reportColumns} data={reportList || []} />
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
