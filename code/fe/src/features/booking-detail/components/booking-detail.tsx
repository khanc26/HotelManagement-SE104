// import { useQuery } from "@tanstack/react-query";
// import { useNavigate, useParams } from "react-router-dom";
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
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import React from "react";
// import { Button } from "@/components/ui/button";
// import { CardContentSkeleton } from "@/components/card-content-skeleton";
// import { CardContentError } from "@/components/card-content-error";

// // Zod schema for BookingDetail
// const bookingDetailSchema = z.object({
//   id: z.string().trim().min(1, { message: "Booking ID is required" }),
//   guestCount: z.number().min(1, { message: "Guest count must be at least 1" }),
//   hasForeigners: z.boolean(),
//   startDate: z.string().trim().min(1, { message: "Start date is required" }),
//   endDate: z.string().trim().min(1, { message: "End date is required" }),
//   status: z.enum(["pending", "checked_in", "checked_out", "cancelled"], {
//     message: "Invalid status",
//   }),
//   approvalStatus: z.enum(["pending", "confirmed", "cancelled"], {
//     message: "Invalid approval status",
//   }),
//   totalPrice: z.string().trim().min(1, { message: "Total price is required" }),
//   room: z.object({
//     roomNumber: z.string().trim(),
//     note: z.string().trim().optional(),
//     status: z.enum(["available", "occupied"]),
//   }),
//   invoice: z.object({
//     id: z.string().trim(),
//     basePrice: z.string().trim(),
//     totalPrice: z.string().trim(),
//     dayRent: z.number(),
//     status: z.enum(["unpaid", "paid", "cancelled"]),
//   }),
//   createdAt: z.string().trim(),
//   updatedAt: z.string().trim(),
//   deletedAt: z.string().trim().nullable(),
// });

// export function BookingDetail() {
//   const { detailId } = useParams();
//   const navigate = useNavigate();

//   // Fetch booking detail data
//   const {
//     data: bookingDetail,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["booking-detail", detailId],
//     queryFn: () => getBookingDetailById(detailId!),
//   });

//   // Initialize form with react-hook-form and zod
//   const form = useForm<z.infer<typeof bookingDetailSchema>>({
//     resolver: zodResolver(bookingDetailSchema),
//     defaultValues: {
//       id: "",
//       guestCount: 0,
//       hasForeigners: false,
//       startDate: "",
//       endDate: "",
//       status: "pending",
//       approvalStatus: "pending",
//       totalPrice: "0",
//       room: {
//         roomNumber: "",
//         note: "",
//         status: "available",
//       },
//       invoice: {
//         id: "",
//         basePrice: "0",
//         totalPrice: "0",
//         dayRent: 0,
//         status: "unpaid",
//       },
//       createdAt: "",
//       updatedAt: "",
//       deletedAt: null,
//     },
//   });

//   // Populate form with booking detail data
//   React.useEffect(() => {
//     if (bookingDetail) {
//       form.reset({
//         id: bookingDetail.id,
//         guestCount: bookingDetail.guestCount,
//         hasForeigners: bookingDetail.hasForeigners,
//         startDate: format(new Date(bookingDetail.startDate), "yyyy-MM-dd"),
//         endDate: format(new Date(bookingDetail.endDate), "yyyy-MM-dd"),
//         status: bookingDetail.status,
//         approvalStatus: bookingDetail.approvalStatus,
//         totalPrice: bookingDetail.totalPrice.toString(),
//         room: {
//           roomNumber: bookingDetail.room.roomNumber,
//           note: bookingDetail.room.note || "",
//           status: bookingDetail.room.status,
//         },
//         invoice: bookingDetail.invoice
//           ? {
//               id: bookingDetail.invoice.id,
//               basePrice: bookingDetail.invoice.basePrice.toString(),
//               totalPrice: bookingDetail.invoice.totalPrice.toString(),
//               dayRent: bookingDetail.invoice.dayRent,
//               status: bookingDetail.invoice.status,
//             }
//           : undefined,
//         createdAt: format(new Date(bookingDetail.createdAt), "yyyy-MM-dd"),
//         updatedAt: format(new Date(bookingDetail.updatedAt), "yyyy-MM-dd"),
//         deletedAt: bookingDetail.deletedAt
//           ? format(new Date(bookingDetail.deletedAt), "yyyy-MM-dd")
//           : null,
//       });
//     }
//   }, [bookingDetail, form]);

//   return (
//     <div className="space-y-4">
//       <Card>
//         <CardHeader className="flex-row justify-between items-center">
//           <CardTitle>Booking Detail Information</CardTitle>
//           <Button onClick={() => navigate("edit")}>Edit</Button>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <CardContentSkeleton items={24} />
//           ) : isError ? (
//             <CardContentError />
//           ) : !bookingDetail ? (
//             <CardContentError errorMessage="This booking is not found" />
//           ) : (
//             <Form {...form}>
//               <form className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="id"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Booking Detail ID</FormLabel>
//                         <FormControl>
//                           <Input {...field} disabled />
//                         </FormControl>
//                         <FormDescription>
//                           Unique identifier for the booking detail
//                         </FormDescription>
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
//                           <Input
//                             type="number"
//                             {...field}
//                             disabled
//                             value={field.value}
//                           />
//                         </FormControl>
//                         <FormDescription>Number of guests</FormDescription>
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
//                           <Select value={field.value.toString()} disabled>
//                             <SelectTrigger>
//                               <SelectValue
//                                 placeholder={field.value ? "Yes" : "No"}
//                               />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="true">Yes</SelectItem>
//                               <SelectItem value="false">No</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormDescription>
//                           Indicates if there are foreign guests
//                         </FormDescription>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="room.roomNumber"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Room Number</FormLabel>
//                         <FormControl>
//                           <Input {...field} disabled />
//                         </FormControl>
//                         <FormDescription>Room number</FormDescription>
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
//                           <Input type="date" {...field} disabled />
//                         </FormControl>
//                         <FormDescription>
//                           Start date of the booking
//                         </FormDescription>
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
//                           <Input type="date" {...field} disabled />
//                         </FormControl>
//                         <FormDescription>
//                           End date of the booking
//                         </FormDescription>
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
//                           <Select value={field.value} disabled>
//                             <SelectTrigger>
//                               <SelectValue placeholder={field.value} />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="pending">Pending</SelectItem>
//                               <SelectItem value="checked_in">
//                                 Checked In
//                               </SelectItem>
//                               <SelectItem value="checked_out">
//                                 Checked Out
//                               </SelectItem>
//                               <SelectItem value="cancelled">
//                                 Cancelled
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormDescription>
//                           Current status of the booking
//                         </FormDescription>
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
//                           <Select value={field.value} disabled>
//                             <SelectTrigger>
//                               <SelectValue placeholder={field.value} />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="pending">Pending</SelectItem>
//                               <SelectItem value="confirmed">
//                                 Confirmed
//                               </SelectItem>
//                               <SelectItem value="cancelled">
//                                 Cancelled
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormDescription>
//                           Approval status of the booking
//                         </FormDescription>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="totalPrice"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Total Price</FormLabel>
//                         <FormControl>
//                           <Input {...field} disabled />
//                         </FormControl>
//                         <FormDescription>
//                           Total price for the booking
//                         </FormDescription>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="invoice.id"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Invoice ID</FormLabel>
//                         <FormControl>
//                           <Input {...field} disabled />
//                         </FormControl>
//                         <FormDescription>Associated invoice ID</FormDescription>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="invoice.basePrice"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Base Price</FormLabel>
//                         <FormControl>
//                           <Input {...field} disabled />
//                         </FormControl>
//                         <FormDescription>Base price per day</FormDescription>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="invoice.dayRent"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Days Rented</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             {...field}
//                             disabled
//                             value={field.value}
//                           />
//                         </FormControl>
//                         <FormDescription>Number of days rented</FormDescription>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="invoice.status"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Invoice Status</FormLabel>
//                         <FormControl>
//                           <Select value={field.value} disabled>
//                             <SelectTrigger>
//                               <SelectValue placeholder={field.value} />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="unpaid">Unpaid</SelectItem>
//                               <SelectItem value="paid">Paid</SelectItem>
//                               <SelectItem value="cancelled">
//                                 Cancelled
//                               </SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                         <FormDescription>
//                           Current status of the invoice
//                         </FormDescription>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="createdAt"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Created At</FormLabel>
//                         <FormControl>
//                           <Input type="date" {...field} disabled />
//                         </FormControl>
//                         <FormDescription>
//                           Date the booking was created
//                         </FormDescription>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="updatedAt"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Updated At</FormLabel>
//                         <FormControl>
//                           <Input type="date" {...field} disabled />
//                         </FormControl>
//                         <FormDescription>
//                           Date the booking was last updated
//                         </FormDescription>
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name="deletedAt"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Deleted At</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="date"
//                             {...field}
//                             disabled
//                             value={field.value || ""}
//                           />
//                         </FormControl>
//                         <FormDescription>
//                           Date the booking was deleted (if applicable)
//                         </FormDescription>
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </form>
//             </Form>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
