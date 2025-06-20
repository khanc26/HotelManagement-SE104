import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getInvoiceById } from "@/api/invoices";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContentSkeleton } from "@/components/card-content-skeleton";
import { CardContentError } from "@/components/card-content-error";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoiceDetailPDFDocument } from "./invoice-detail-pdf-document";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const invoiceSchema = z.object({
  id: z.string(),
  basePrice: z.number(),
  totalPrice: z.number(),
  dayRent: z.number(),
  status: z.string(),
  roomNumber: z.string(),
  payer: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export function InvoiceDetail() {
  const { id } = useParams();

  const {
    data: invoice,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id!),
  });

  const form = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      id: "",
      basePrice: 0,
      totalPrice: 0,
      dayRent: 0,
      status: "",
      roomNumber: "",
      payer: "",
      createdAt: "",
      updatedAt: "",
    },
  });

  React.useEffect(() => {
    if (invoice) {
      form.reset({
        id: invoice.id,
        basePrice: invoice.basePrice,
        totalPrice: invoice.totalPrice,
        dayRent: invoice.dayRent,
        status: invoice.status,
        roomNumber: invoice.booking.room.roomNumber,
        payer: invoice.booking.user.email,
        createdAt: format(new Date(invoice.createdAt), "yyyy-MM-dd HH:mm"),
        updatedAt: format(new Date(invoice.updatedAt), "yyyy-MM-dd HH:mm"),
      });
    }
  }, [invoice, form]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice Information</CardTitle>
          {invoice && (
            <PDFDownloadLink
              key={Date.now()}
              document={<InvoiceDetailPDFDocument invoice={invoice} />}
              fileName="invoice-detail.pdf"
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
          {isLoading ? (
            <CardContentSkeleton items={8} />
          ) : isError ? (
            <CardContentError />
          ) : !invoice ? (
            <CardContentError errorMessage="This invoice is not found" />
          ) : (
            <Form {...form}>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="roomNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Number</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>Room number</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={formatCurrency(field.value)}
                            disabled
                          />
                        </FormControl>
                        <FormDescription>Base price per day</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={formatCurrency(field.value)}
                            disabled
                          />
                        </FormControl>
                        <FormDescription>Total price for the stay</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dayRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days Rented</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>Number of days rented</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={() => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <InvoiceStatusBadge status={invoice.status} />
                          </div>
                        </FormControl>
                        <FormDescription>Current status of the invoice</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payer</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>Email of the person who paid</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="createdAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Created At</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Date the invoice was created
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="updatedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Updated At</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Date the invoice was last updated
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
