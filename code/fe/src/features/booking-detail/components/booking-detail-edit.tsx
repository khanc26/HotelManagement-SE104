// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import { getBookingDetailById } from "@/api/booking-details";
// import { format } from "date-fns";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormDescription,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   BookingDetailsApprovalStatus,
//   BookingDetailsStatus,
//   UpdateBookingDetailRequest,
// } from "@/types/booking-detail";
// import { updateBooking } from "@/api/bookings";
// import { toast } from "react-toastify";
// import { CardContentSkeleton } from "@/components/card-content-skeleton";
// import { CardContentError } from "@/components/card-content-error";
// import { Loader2 } from "lucide-react";
// import { RoomPickerInput } from "@/features/room/components/room-picker-input";

// const roomSchema = z.object({
//   id: z.string().trim().min(1, { message: "Room is required" }),
//   roomNumber: z.string().trim(), // Add any fields you need
// });

// // Zod schema for BookingDetail
// const bookingDetailSchema = z.object({
//   bookingDetailId: z.string().trim().min(1, { message: "Booking ID is required" }),
//   guestCount: z.coerce
//     .number()
//     .min(1, { message: "Guest count must be at least 1" }),
//   hasForeigners: z.boolean(),
//   startDate: z.string().trim().min(1, { message: "Start date is required" }),
//   endDate: z.string().trim().min(1, { message: "End date is required" }),
//   status: z.enum(["pending", "checked_in", "checked_out", "cancelled"], {
//     message: "Invalid status",
//   }),
//   approvalStatus: z.enum(["pending", "confirmed", "cancelled"], {
//     message: "Invalid approval status",
//   }),
//   room: roomSchema,
// });

// export function BookingDetailEdit() {
//   const { id, detailId } = useParams();
//   const queryClient = useQueryClient();

//   // Fetch booking detail data
//   const {
//     data: bookingDetail,
//     isLoading: isQueryLoading,
//     isError: isQueryError,
//   } = useQuery({
//     queryKey: ["booking-detail", detailId],
//     queryFn: () => getBookingDetailById(detailId!),
//   });

//   // Initialize form with react-hook-form and zod
//   const form = useForm<z.infer<typeof bookingDetailSchema>>({
//     resolver: zodResolver(bookingDetailSchema),
//     defaultValues: {
//       bookingDetailId: "",
//       guestCount: 1,
//       hasForeigners: false,
//       startDate: "",
//       endDate: "",
//       status: "pending",
//       approvalStatus: "pending",
//       room: {
//         id: "",
//         roomNumber: "",
//       },
//     },
//   });

//   // Populate form with booking detail data
//   React.useEffect(() => {
//     if (bookingDetail) {
//       form.reset({
//         bookingDetailId: bookingDetail.id,
//         guestCount: bookingDetail.guestCount,
//         hasForeigners: bookingDetail.hasForeigners,
//         startDate: format(new Date(bookingDetail.startDate), "yyyy-MM-dd"),
//         endDate: format(new Date(bookingDetail.endDate), "yyyy-MM-dd"),
//         status: bookingDetail.status,
//         approvalStatus: bookingDetail.approvalStatus,
//         room: {
//           id: bookingDetail.room.id,
//           roomNumber: bookingDetail.room.roomNumber,
//         },
//       });
//     }
//   }, [bookingDetail, form]);

//   const mutation = useMutation({
//     mutationFn: ({
//       id,
//       updatedBookingDetail,
//     }: {
//       id: string;
//       updatedBookingDetail: UpdateBookingDetailRequest;
//     }) => updateBooking(id, updatedBookingDetail),
//     onSuccess: () => {
//       toast.success("Booking updated successfully.");
//       queryClient.invalidateQueries({ queryKey: ["booking-detail", id] });
//     },
//     onError: (error: unknown) => {
//       console.error("Update failed:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error occurred";
//       toast.error(`Failed to update booking: ${errorMessage}`);
//     },
//   });

//   function onSubmit(values: z.infer<typeof bookingDetailSchema>) {
//     if (!id) return;

//     const updatedBookingDetail: UpdateBookingDetailRequest = {
//       bookingDetailId: values.bookingDetailId,
//       guestCount: values.guestCount,
//       hasForeigners: values.hasForeigners,
//       startDate: new Date(values.startDate),
//       endDate: new Date(values.endDate),
//       status: values.status as BookingDetailsStatus,
//       approvalStatus: values.approvalStatus as BookingDetailsApprovalStatus,
//       roomId: values.room.id,
//     };


//     mutation.mutate({ id: id, updatedBookingDetail });
//   }

//   return (
//     <div className="space-y-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Booking Detail Information Edit</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isQueryLoading ? (
//             <CardContentSkeleton />
//           ) : isQueryError ? (
//             <CardContentError />
//           ) : !bookingDetail ? (
//             <CardContentError errorMessage="This booking is not found" />
//           ) : (
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-4"
//               >
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="bookingDetailId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Booking Detail ID</FormLabel>
//                         <FormControl>
//                           <Input {...field} disabled />
//                         </FormControl>
//                         <FormDescription>
//                           Unique identifier for the booking detail
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="guestCount"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Guest Count</FormLabel>
//                         <FormControl>
//                           <Input type="number" {...field} />
//                         </FormControl>
//                         <FormDescription>Number of guests</FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="hasForeigners"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Has Foreigners</FormLabel>
//                         <FormControl>
//                           <select
//                             {...field}
//                             className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
//                             value={field.value.toString()}
//                             onChange={(e) =>
//                               field.onChange(e.target.value === "true")
//                             }
//                           >
//                             <option value="true">Yes</option>
//                             <option value="false">No</option>
//                           </select>
//                         </FormControl>
//                         <FormDescription>
//                           Indicates if there are foreign guests
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="room"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Room Number</FormLabel>
//                         <FormControl>
//                           <RoomPickerInput
//                             value={field.value}
//                             onChange={(room) => form.setValue("room", room)}
//                             placeholder="Select a room"
//                           />
//                         </FormControl>
//                         <FormDescription>Room identifier</FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="startDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Start Date</FormLabel>
//                         <FormControl>
//                           <Input type="date" {...field} />
//                         </FormControl>
//                         <FormDescription>
//                           Start date of the booking
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="endDate"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>End Date</FormLabel>
//                         <FormControl>
//                           <Input type="date" {...field} />
//                         </FormControl>
//                         <FormDescription>
//                           End date of the booking
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="status"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Status</FormLabel>
//                         <FormControl>
//                           <select
//                             {...field}
//                             className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
//                             value={field.value}
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="checked_in">Checked In</option>
//                             <option value="checked_out">Checked Out</option>
//                             <option value="cancelled">Cancelled</option>
//                           </select>
//                         </FormControl>
//                         <FormDescription>
//                           Current status of the booking
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="approvalStatus"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Approval Status</FormLabel>
//                         <FormControl>
//                           <select
//                             {...field}
//                             className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
//                             value={field.value}
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="confirmed">Confirmed</option>
//                             <option value="cancelled">Cancelled</option>
//                           </select>
//                         </FormControl>
//                         <FormDescription>
//                           Approval status of the booking
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <Button
//                     type="submit"
//                     className="w-full"
//                     disabled={mutation.isPending}
//                   >
//                     {mutation.isPending ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Updating...
//                       </>
//                     ) : (
//                       "Update Booking Detail"
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
