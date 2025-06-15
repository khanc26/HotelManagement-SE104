import { DataTable } from "@/components/ui/data-table";
import { getInvoices } from "@/api/invoices";
import { invoiceColumns } from "./invoice-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/table-skeleton";
import { TableError } from "@/components/table-error";

export const UserInvoiceList = () => {
  const { data: invoices, isLoading, isError } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>My Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : isError ? (
            <TableError errorMessage="Error fetching invoices" />
          ) : invoices ? (
            <DataTable columns={invoiceColumns} data={invoices} />
          ) : (
            <div>No invoices found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
