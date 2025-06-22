import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Room } from "@/types/room.type";
import { formatCurrency } from "@/utils/helpers/formatCurrency";

export const roomColumns: ColumnDef<Room>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(e.target.checked)}
          className="peer hidden"
          // disabled={row.original.status !== "available"}
        />
        <div
          className={`w-5 h-5 border-2 rounded transition-colors ${"border-black peer-checked:bg-black"}`}
        />
      </label>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "roomNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Room Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "roomType.name",
    header: "Room Type",
  },
  {
    accessorKey: "roomType.maxGuests",
    header: "Max Guests",
  },
  {
    accessorKey: "roomType.roomPrice",
    header: "Price per Night",
    cell: ({ row }) => formatCurrency(row.original.roomType.roomPrice),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.original.status === "available"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.original.status.charAt(0).toUpperCase() +
          row.original.status.slice(1)}
      </span>
    ),
  },
];
