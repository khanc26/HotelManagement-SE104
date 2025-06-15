import { Booking } from "@/types/booking.type";
import { format } from "date-fns";
import { BookingActionCell } from "./booking-action-cell";

interface RowData {
  original: Booking;
}

export const columns = [
  {
    accessorKey: "room.roomNumber",
    header: "Room Number",
  },
  {
    accessorKey: "checkInDate",
    header: "Check In Date",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.checkInDate), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "checkOutDate",
    header: "Check Out Date",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.checkOutDate), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "user.email",
    header: "Booker Email",
  },
  {
    accessorKey: "participants",
    header: "Participants",
    cell: ({ row }: { row: RowData }) => {
      return row.original.participants.length;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.createdAt), "MMM dd, yyyy HH:mm");
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.updatedAt), "MMM dd, yyyy HH:mm");
    },
  },
  {
    id: "actions",
    cell: ({ row }: { row: RowData }) => {
      const booking = row.original;
      return <BookingActionCell booking={booking} />;
    },
  },
];
