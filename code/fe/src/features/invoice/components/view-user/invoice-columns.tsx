import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Invoice, InvoicesStatus } from "@/types/invoice.type";
import { formatCurrency } from "@/lib/utils";

export const invoiceColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
  },
  {
    accessorKey: "bookingDetail.room.roomNumber",
    header: "Room",
  },
  {
    accessorKey: "bookingDetail.startDate",
    header: "Check In",
    cell: ({ row }) => {
      return new Date(row.original.bookingDetail.startDate).toLocaleDateString();
    },
  },
  {
    accessorKey: "bookingDetail.endDate",
    header: "Check Out",
    cell: ({ row }) => {
      return new Date(row.original.bookingDetail.endDate).toLocaleDateString();
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
    accessorKey: "status",
    header: "Status",
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