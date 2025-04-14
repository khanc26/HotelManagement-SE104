import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getBookingById, deleteBookingDetail } from "@/api/bookings";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { BookingDetail as BookingDetailType } from "@/types/booking-detail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
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
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
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
          <DialogTitle>Are you absolutely sure?</DialogTitle>
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
    cell: ({ row }: { row: RowData }) => {
      return (
        row.original.status.charAt(0).toUpperCase() +
        row.original.status.slice(1)
      );
    },
  },
  {
    accessorKey: "approvalStatus",
    header: "Approval Status",
    cell: ({ row }: { row: RowData }) => {
      return (
        row.original.approvalStatus.charAt(0).toUpperCase() +
        row.original.approvalStatus.slice(1)
      );
    },
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
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id!),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  console.log(booking.bookingDetails);

  return (
    <div className="space-y-4">
      {/* Booking Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
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
              <p>{format(new Date(booking.createdAt), "MMM dd, yyyy")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Detail List</CardTitle>
        </CardHeader>
        <div className="flex">
          <CardContent className="flex-1 w-1">
            <DataTable columns={columns} data={booking.bookingDetails || []} />
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
