import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomType } from "@/types/room-type.type"; // Đảm bảo kiểu RoomType được import đúng
import { RoomTypeActionCell } from "./room-type-action-cell"; // Import cell cho các hành động

export const RoomTypeColumns: ColumnDef<RoomType>[] = [
 /* {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },*/
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.roomPrice;
      // Convert string to number and format with 2 decimal places
      const formattedPrice =
        typeof price === "string"
          ? parseFloat(price).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          : price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
      return formattedPrice;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const roomType = row.original;

      return <RoomTypeActionCell roomType={roomType} />;
    },
  },
];
