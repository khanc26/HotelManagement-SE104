import { DataTable } from "@/components/ui/data-table";
import { invoiceColumns } from "./invoice-columns"; // Create this file for columns definition
import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/api/invoices"; // Ensure this API function is defined
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetAPIErrorResponseData } from "@/utils/helpers/getAPIErrorResponseData";
import { TableSkeleton } from "@/components/table-skeleton";
import { TableError } from "@/components/table-error";

export function InvoiceList() {
  const {
    data: invoices,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  const errorMessage = isError
    ? `Error fetching invoices: ${GetAPIErrorResponseData(error).message}`
    : "Error fetching invoices";

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
        </CardHeader>
        <div className="flex">
          <CardContent className="flex-1 w-1">
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <TableError errorMessage={`${errorMessage}`} />
            ) : (
              <DataTable columns={invoiceColumns} data={invoices || []} />
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
