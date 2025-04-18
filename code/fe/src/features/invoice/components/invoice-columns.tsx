import { ColumnDef } from "@tanstack/react-table";
import { InvoiceActionsCell } from "./invoice-action-cell";
import { Invoice } from "@/types/invoice.type";
import { format } from "date-fns";

interface RowData {
  original: Invoice;
}

export const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "bookingDetail.room.roomNumber",
    header: "Room Number",
  },
  {
    accessorKey: "dayRent",
    header: "Day Rent",
  },
  {
    accessorKey: "basePrice",
    header: "Base Price",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.createdAt), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "deletedAt",
    header: "Deleted At",
    cell: ({ row }: { row: RowData }) => {
      const deletedAt = row.original.deletedAt;
      return deletedAt ? format(new Date(deletedAt), "MMM dd, yyyy") : "—";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      return <InvoiceActionsCell invoiceId={invoice.id} />;
    },
  },
];
