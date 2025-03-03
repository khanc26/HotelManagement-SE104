import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  note?: string;
  status: "unknown" | "occupied" | "available";
};

export const roomColumns: ColumnDef<Room>[] = [
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
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "note",
    header: "Note",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
