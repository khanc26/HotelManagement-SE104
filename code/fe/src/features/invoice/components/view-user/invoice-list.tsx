import { DataTable } from "@/components/ui/data-table";
import { Invoice } from "@/types/invoice.type";
import { getInvoices } from "@/api/invoices";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { invoiceColumns } from "./invoice-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { payInvoice } from "@/api/payments";

export const InvoiceList = () => {
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
      payInvoice(
        customEvent.detail.invoice.id,
        customEvent.detail.invoice.totalPrice
      )
        .then((response) => {
          window.location.href = response.paymentUrl;
        })
        .catch((error) => {
          console.error("Error initiating payment:", error);
          toast.error("Failed to initiate payment");
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
    <div className="container mx-auto py-6">
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
