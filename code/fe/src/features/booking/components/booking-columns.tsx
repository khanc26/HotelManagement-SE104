import { Booking } from "@/types/booking.type";
import { format } from "date-fns";
import { BookingActionCell } from "./booking-action-cell";

interface RowData {
  original: Booking;
}

export const columns = [
  {
    accessorKey: "user.email",
    header: "User Email",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }: { row: RowData }) => {
      return `$${row.original.totalPrice}`;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.createdAt), "MMM dd, yyyy");
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: RowData }) => {
      const booking = row.original;
      return <BookingActionCell booking={booking} />;
    },
  },
];
