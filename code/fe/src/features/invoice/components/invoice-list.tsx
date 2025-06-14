import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInvoices } from "@/api/invoices";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./invoice-columns";
import { TableSkeleton } from "@/components/table-skeleton";
import { TableError } from "@/components/table-error";

export function InvoiceList() {
  const {
    data: invoices,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
      </CardHeader>
      <div className="flex">
        <CardContent className="flex-1 w-1">
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <TableError errorMessage="Error fetching invoices" />
          ) : invoices ? (
            <DataTable columns={columns} data={invoices} />
          ) : (
            <div>No invoices found</div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
