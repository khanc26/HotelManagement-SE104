import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/helpers/formatCurrency";
import { ReportActionCell } from "./report-action-cell";
import { MonthlyRevenue } from "@/types/report.type";

export const reportColumns: ColumnDef<MonthlyRevenue>[] = [
  {
    accessorKey: "month",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Month
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "totalRevenue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.totalRevenue;

      return formatCurrency(price);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original;

      return <ReportActionCell report={report} />;
    },
  },
];
