import { ColumnDef } from "@tanstack/react-table";
import { InvoiceActionsCell } from "./invoice-action-cell";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Booking } from "@/types/booking.type";

interface RowData {
  original: Booking;
}

export const invoiceColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: { row: RowData }) => {
      return formatCurrency(row.original.totalPrice);
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: { row: RowData }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;
      return <InvoiceActionsCell bookingId={booking.id} />;
    },
  },
];
