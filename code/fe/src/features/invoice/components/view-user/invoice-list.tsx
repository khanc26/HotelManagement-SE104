import { DataTable } from "@/components/ui/data-table";
import { Invoice } from "@/types/invoice.type";
import { getInvoices } from "@/api/invoices";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { invoiceColumns } from "./invoice-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { payInvoice } from "@/api/invoices";

export const UserInvoiceList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();

    const handlePayInvoice = (event: Event) => {
      const customEvent = event as CustomEvent<{ invoice: Invoice }>;
      payInvoice(customEvent.detail.invoice.id)
        .then(() => {
          toast.success("Invoice paid successfully");
          fetchInvoices(); // Refresh the list after payment
        })
        .catch((error) => {
          console.error("Error paying invoice:", error);
          toast.error("Failed to pay invoice");
        });
    };

    window.addEventListener("pay-invoice", handlePayInvoice);

    return () => {
      window.removeEventListener("pay-invoice", handlePayInvoice);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>My Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={invoiceColumns} data={invoices} />
        </CardContent>
      </Card>
    </div>
  );
};
