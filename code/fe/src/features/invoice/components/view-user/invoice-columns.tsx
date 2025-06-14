import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Invoice, InvoicesStatus } from "@/types/invoice.type";
import { formatCurrency } from "@/lib/utils";
import { InvoiceStatusBadge } from "../invoice-status-badge";
import { format } from "date-fns";

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
      return format(new Date(row.original.booking.checkOutDate), "MMM dd, yyyy");
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
        <div className="flex items-center gap-2">
          {invoice.status === InvoicesStatus.UNPAID && (
            <Button
              onClick={() => {
                // This will be handled by the parent component
                window.dispatchEvent(
                  new CustomEvent("pay-invoice", {
                    detail: { invoice },
                  })
                );
              }}
              variant="default"
              size="sm"
            >
              Pay Now
            </Button>
          )}
        </div>
      );
    },
  },
];
