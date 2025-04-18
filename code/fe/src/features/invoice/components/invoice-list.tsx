import { DataTable } from "@/components/ui/data-table";
import { invoiceColumns } from "./invoice-columns"; // Create this file for columns definition
import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/api/invoices"; // Ensure this API function is defined
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { GetAPIErrorResponseData } from "@/utils/helpers/getAPIErrorResponseData";

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

  if (isError) {
    const errorData = GetAPIErrorResponseData(error);
    toast.error(`Error fetching invoices: ${errorData.message}`);
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <DataTable columns={invoiceColumns} data={invoices || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
