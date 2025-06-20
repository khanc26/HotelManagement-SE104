import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBookingById } from "@/api/bookings";
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
import { DataTable } from "@/components/ui/data-table";
import { columns as participantColumns } from "./participant-columns";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { BookingDetailPDFDocument } from "./booking-detail-pdf-document";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const bookingSchema = z.object({
  id: z.string(),
  roomNumber: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  booker: z.object({
    email: z.string().email(),
    fullName: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
});

export function BookingDetail() {
  const { id } = useParams();

  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id!),
  });

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      id: "",
      roomNumber: "",
      checkInDate: "",
      checkOutDate: "",
      booker: {
        email: "",
        fullName: "",
      },
      createdAt: "",
      updatedAt: "",
      deletedAt: null,
    },
  });

  React.useEffect(() => {
    if (booking) {
      console.log(booking);
      form.reset({
        id: booking.id,
        roomNumber: booking.room.roomNumber,
        checkInDate: format(new Date(booking.checkInDate), "yyyy-MM-dd"),
        checkOutDate: format(new Date(booking.checkOutDate), "yyyy-MM-dd"),
        booker: {
          email: booking.user.email,
        },
        createdAt: format(new Date(booking.createdAt), "yyyy-MM-dd"),
        updatedAt: format(new Date(booking.updatedAt), "yyyy-MM-dd"),
      });
    }
  }, [booking, form]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Booking Information</CardTitle>
          {booking && (
            <PDFDownloadLink
              key={Date.now()}
              document={<BookingDetailPDFDocument booking={booking} />}
              fileName="booking-detail.pdf"
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
          ) : !booking ? (
            <CardContentError errorMessage="This booking is not found" />
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
                    name="checkInDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check In Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Check in date of the booking
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="checkOutDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check Out Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Check out date of the booking
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="booker.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booker Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>Booker's email address</FormDescription>
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
                        <FormDescription>
                          Date the booking was created
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
                          <Input type="date" {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Date the booking was last updated
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

      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CardContentSkeleton items={5} />
          ) : isError ? (
            <CardContentError />
          ) : !booking ? (
            <CardContentError errorMessage="This booking is not found" />
          ) : (
            <DataTable
              columns={participantColumns}
              data={booking.participants}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 