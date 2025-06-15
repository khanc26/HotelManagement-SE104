import { ColumnDef } from "@tanstack/react-table";
import { Invoice } from "@/types/invoice.type";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { InvoiceActionCell } from "./invoice-action-cell";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface RowData {
  original: Invoice;
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "booking.room.roomNumber",
    header: "Room Number",
  },
  {
    accessorKey: "booking.checkInDate",
    header: "Check In",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.booking.checkInDate), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "booking.checkOutDate",
    header: "Check Out",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.booking.checkOutDate), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "basePrice",
    header: "Base Price",
    cell: ({ row }: { row: RowData }) => {
      return formatCurrency(row.original.basePrice);
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }: { row: RowData }) => {
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
    cell: ({ row }: { row: RowData }) => {
      return <InvoiceStatusBadge status={row.original.status} />;
    },
  },
  {
    accessorKey: "booking.user.email",
    header: "Payer",
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
      const invoice = row.original;
      return <InvoiceActionCell invoice={invoice} />;
    },
  },
];
