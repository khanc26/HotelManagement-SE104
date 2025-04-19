import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getInvoiceById } from "@/api/invoices"; // Ensure this API function is defined
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
  FormDescription,
} from "@/components/ui/form";
import React from "react";
import { CardContentSkeleton } from "@/components/card-content-skeleton";
import { CardContentError } from "@/components/card-content-error";

// Zod schema for Invoice
const invoiceSchema = z.object({
  id: z.string(),
  basePrice: z.number(),
  totalPrice: z.number(),
  dayRent: z.number(),
  status: z.enum(["unpaid", "paid", "cancelled"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export function InvoiceDetail() {
  const { id } = useParams();
  const {
    data: invoice,
    isLoading,
    isError,
    // error,
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
      status: "unpaid",
      createdAt: "",
      updatedAt: "",
    },
  });

  // Populate form with invoice data
  React.useEffect(() => {
    if (invoice) {
      form.reset({
        id: invoice.id,
        basePrice: invoice.basePrice,
        totalPrice: invoice.totalPrice,
        dayRent: invoice.dayRent,
        status: invoice.status,
        createdAt: new Date(invoice.createdAt).toISOString().split("T")[0], // Format date for input
        updatedAt: new Date(invoice.updatedAt).toISOString().split("T")[0], // Format date for input
      });
    }
  }, [invoice, form]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CardContentSkeleton />
          ) : isError ? (
            <CardContentError errorMessage="Error while getting this invoice detail." />
          ) : (
            <Form {...form}>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice ID</FormLabel>
                        <Input {...field} disabled />
                        <FormDescription>
                          Unique identifier for the invoice
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price</FormLabel>
                        <Input type="number" {...field} disabled />
                        <FormDescription>
                          Base price of the invoice
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Price</FormLabel>
                        <Input type="number" {...field} disabled />
                        <FormDescription>Total amount due</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dayRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day Rent</FormLabel>
                        <Input type="number" {...field} disabled />
                        <FormDescription>Daily rental price</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Input {...field} disabled />
                        <FormDescription>
                          Current status of the invoice
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="createdAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Created At</FormLabel>
                        <Input type="date" {...field} disabled />
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
                        <Input type="date" {...field} disabled />
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