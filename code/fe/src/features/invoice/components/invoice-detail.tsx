import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import React from "react";
import { CardContentSkeleton } from "@/components/card-content-skeleton";
import { CardContentError } from "@/components/card-content-error";
import { getBookingById } from "@/api/bookings";
import { TableSkeleton } from "@/components/table-skeleton";
import { TableError } from "@/components/table-error";
import { DataTable } from "@/components/ui/data-table";
import { invoiceDetailColumns } from "./invoice-detail-columns";
// import { PDFDownloadLink } from '@react-pdf/renderer';
// import { BookingDetailPDFDocument } from './invoice-detail-pdf-document';
// import { Button } from '@/components/ui/button';
// import { Download } from 'lucide-react';

// Zod schema for Invoice
const invoiceSummarySchema = z.object({
  email: z.string().email(),
  totalPrice: z.number().min(0),
  createdAt: z.string(),
});

export function InvoiceDetail() {
  const { id } = useParams();
  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id!),
  });

  const form = useForm<z.infer<typeof invoiceSummarySchema>>({
    resolver: zodResolver(invoiceSummarySchema),
    defaultValues: {
      email: "",
      totalPrice: 0,
      createdAt: "",
    },
  });

  // Populate form with invoice data
  React.useEffect(() => {
    if (booking) {
      form.reset({
        email: booking.user.email,
        totalPrice: booking.totalPrice,
        createdAt: new Date(booking.createdAt).toISOString().split("T")[0], // Format for input
      });
    }
  }, [booking, form]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice Details</CardTitle>
          {/* {booking && (
            <PDFDownloadLink
              document={<BookingDetailPDFDocument booking={booking} />}
              fileName={`booking-${booking.id}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading}>
                  {loading ? (
                    'Generating PDF...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          )} */}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CardContentSkeleton />
          ) : isError ? (
            <CardContentError errorMessage="Error while getting this invoice detail." />
          ) : (
            <Form {...form}>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payer</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
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
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            disabled
                          />
                        </FormControl>
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
                          <Input type="date" {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* DataTable for Invoice Details */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
        </CardHeader>
        <div className="flex">
          <CardContent className="flex-1 w-1">
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <TableError errorMessage={"Error fetching invoice list"} />
            ) : booking?.bookingDetails ? (
              <DataTable
                columns={invoiceDetailColumns}
                data={booking.bookingDetails}
              />
            ) : (
              <div>No booking details found</div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
