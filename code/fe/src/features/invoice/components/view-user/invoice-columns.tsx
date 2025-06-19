import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/types/invoice.type";
import { formatCurrency } from "@/lib/utils";
import { InvoiceStatusBadge } from "../invoice-status-badge";
import { format } from "date-fns";
import { InvoicePaymentButton } from "./invoice-payment-button";

export const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "booking.room.roomNumber",
    header: "Room",
  },
  {
    accessorKey: "booking.checkInDate",
    header: "Check In",
    cell: ({ row }) => {
      return format(new Date(row.original.booking.checkInDate), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "booking.checkOutDate",
    header: "Check Out",
    cell: ({ row }) => {
      return format(
        new Date(row.original.booking.checkOutDate),
        "MMM dd, yyyy"
      );
    },
  },
  {
    accessorKey: "basePrice",
    header: "Base Price",
    cell: ({ row }) => {
      return formatCurrency(row.original.basePrice);
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => {
      return formatCurrency(row.original.totalPrice);
    },
  },
  {
    accessorKey: "dayRent",
    header: "Days Rented",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <InvoicePaymentButton invoiceId={invoice.id} amount={invoice.totalPrice} status={invoice.status} />
      );
    },
  },
];
