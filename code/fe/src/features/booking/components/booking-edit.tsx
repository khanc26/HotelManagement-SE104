import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UserTableInput } from "@/features/booking/components/user-table-input";
import { InputDatePicker } from "@/components/ui/input-date-picker";
import { UserType } from "@/types/user.type";
import { getBookingById, updateBooking } from "@/api/bookings"; // Assume this fetches booking details
import { TableSkeleton } from "@/components/table-skeleton";
import { TableError } from "@/components/table-error";
import { useParams } from "react-router";
import { RoomPickerInput } from "@/features/room/components/room-picker-input";

// Define the form schema using Zod
const bookingEditSchema = z
  .object({
    room: z.object({
      id: z.string().trim().min(1, { message: "Room is required" }),
      roomNumber: z.string().trim(),
    }),
    participants: z
      .array(
        z.object({
          email: z.string().email(),
          fullName: z.string().min(1, { message: "Full name is required" }),
          address: z.string().min(1, { message: "Address is required" }),
          identityNumber: z
            .string()
            .min(1, { message: "Identity number is required" }),
          userType: z.nativeEnum(UserType),
        })
      )
      .min(1, "At least one participant is required"),
    startDate: z
      .string()
      .trim()
      .refine(
        (val) => {
          const date = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        { message: "Start date must be today or later" }
      ),
    endDate: z
      .string()
      .trim()
      .refine(
        (val) => {
          const date = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date > today;
        },
        { message: "End date must be after today" }
      ),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

type BookingEditFormValues = z.infer<typeof bookingEditSchema>;

export function BookingEdit() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Fetch booking details
  const {
    data: booking,
    isLoading: isQueryLoading,
    isError: isQueryError,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id!),
  });

  // Initialize form
  const form = useForm<BookingEditFormValues>({
    resolver: zodResolver(bookingEditSchema),
    defaultValues: {
      room: { id: "", roomNumber: "" },
      participants: [],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
    },
  });

  // Populate form with booking data
  useEffect(() => {
    if (booking) {
      form.reset({
        room: {
          id: booking.room.id,
          roomNumber: booking.room.roomNumber || "",
        },
        participants: [],
        startDate: new Date(booking.checkInDate).toISOString().split("T")[0],
        endDate: new Date(booking.checkOutDate).toISOString().split("T")[0],
      });
      //   setMaxGuests(booking.room.roomType.name?.maxGuests || 5);
    }
  }, [booking, form]);

  // Mutation for updating booking
  const { mutate: updateBookingMutation, isPending: isSubmitting } =
    useMutation({
      mutationFn: (data: BookingEditFormValues) =>
        updateBooking(id!, {
          roomId: data.room.id,
          participants: data.participants,
          checkInDate: new Date(data.startDate).toISOString(),
          checkOutDate: new Date(data.endDate).toISOString(),
        }),
      onSuccess: () => {
        toast.success("Booking updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["booking", id!] });
      },
    });

  const onSubmit = async (data: BookingEditFormValues) => {
    await updateBookingMutation(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Booking</CardTitle>
        <CardDescription>Update the details of your booking.</CardDescription>
      </CardHeader>
      <CardContent>
        {isQueryLoading ? (
          <TableSkeleton />
        ) : isQueryError || !booking ? (
          <TableError errorMessage="Failed to load booking details" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <FormControl>
                      <RoomPickerInput
                        value={field.value}
                        onChange={(room) => form.setValue("room", room)}
                        placeholder="Select a room"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <InputDatePicker
                          control={form.control}
                          name="startDate"
                          label="Check-in Date"
                          minDate={new Date()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <InputDatePicker
                          control={form.control}
                          name="endDate"
                          label="Check-out Date"
                          minDate={
                            form.watch("startDate")
                              ? new Date(form.watch("startDate"))
                              : new Date()
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <UserTableInput
                        value={field.value}
                        onChange={field.onChange}
                        notUser={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Booking"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
