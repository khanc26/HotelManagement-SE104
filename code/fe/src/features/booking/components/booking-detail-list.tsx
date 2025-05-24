import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getBookingById, deleteBookingDetail } from "@/api/bookings";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { BookingDetail as BookingDetailType } from "@/types/booking-detail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, MoreHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { TableSkeleton } from "@/components/table-skeleton";
import { TableError } from "@/components/table-error";
import { CardContentSkeleton } from "@/components/card-content-skeleton";
import { CardContentError } from "@/components/card-content-error";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  approvalStatusStyleMap,
  bookingStatusStyleMap,
} from "./booking-status-map";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BookingDetailPDFDocument } from './booking-detail-pdf-document';

// DataTable columns
interface RowData {
  original: BookingDetailType;
}

function BookingDetailActionCell({
  bookingDetail,
}: {
  bookingDetail: BookingDetailType;
}) {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const deleteMutation = useMutation({
    mutationFn: (bookingDetailId: string) =>
      deleteBookingDetail(id!, [bookingDetailId]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      toast.success("Delete booking detail successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Error! " + errorMessage);
    },
  });

  const handleDelete = () => {
    // console.log("Delete", bookingDetail.id);
    deleteMutation.mutate(bookingDetail.id);
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to={`/bookings/${id}/${bookingDetail.id}`}>
              <p className="text-sm font-normal">View</p>
            </Link>
          </DropdownMenuItem>

          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to soft delete this booking detail (if no
            booking detail left in this booking after that, the booking will be
            deleted as well)?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const columns = [
  {
    accessorKey: "guestCount",
    header: "Guest Count",
  },
  {
    accessorKey: "hasForeigners",
    header: "Has Foreigners",
    cell: ({ row }: { row: RowData }) => {
      return row.original.hasForeigners ? "Yes" : "No";
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.startDate), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.endDate), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: RowData }) => (
      <StatusBadge
        status={row.original.status}
        statusStyleMap={bookingStatusStyleMap}
      />
    ),
  },
  {
    accessorKey: "approvalStatus",
    header: "Approval Status",
    cell: ({ row }: { row: RowData }) => (
      <StatusBadge
        status={row.original.approvalStatus}
        statusStyleMap={approvalStatusStyleMap}
      />
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }: { row: RowData }) => {
      return formatCurrency(row.original.totalPrice);
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
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }: { row: RowData }) => {
      return format(new Date(row.original.updatedAt), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "deletedAt",
    header: "Deleted At",
    cell: ({ row }: { row: RowData }) => {
      return row.original.deletedAt
        ? format(new Date(row.original.deletedAt), "MMM dd, yyyy")
        : "N/A";
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }: { row: RowData }) => {
      const bookingDetail = row.original;
      return <BookingDetailActionCell bookingDetail={bookingDetail} />;
    },
  },
];

export function BookingDetailList() {
  const { id } = useParams();

  // Fetch booking data
  const {
    data: booking,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id!),
  });

  return (
    <div className="space-y-4">
      {/* Booking Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <CardContentSkeleton />
          ) : isError ? (
            <CardContentError />
          ) : !booking ? (
            <CardContentError errorMessage="This booking is not found" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold">Booking ID</p>
                <p>{booking.id}</p>
              </div>
              <div>
                <p className="font-semibold">User Email</p>
                <p>{booking.user.email}</p>
              </div>
              <div>
                <p className="font-semibold">Total Price</p>
                <p>${booking.totalPrice}</p>
              </div>
              <div>
                <p className="font-semibold">Created At</p>
                <p>
                  {new Date(booking.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Room Details Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Booking Details</CardTitle>
          {booking && (
            <PDFDownloadLink
            key={Date.now()}
              document={<BookingDetailPDFDocument booking={booking} />}
              fileName={`booking-${booking.id}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" size="sm" disabled={loading}>
                  {loading ? (
                    'Generating PDF...'
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </CardHeader>
        <div className="flex">
          <CardContent className="flex-1 w-1">
            {isLoading ? (
              <TableSkeleton />
            ) : isError ? (
              <TableError />
            ) : !booking ? (
              <TableError errorMessage="This booking is not found" />
            ) : (
              <DataTable
                columns={columns}
                data={booking.bookingDetails || []}
              />
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
