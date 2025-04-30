import { Button } from "@/components/ui/button";
import { MonthlyRevenue } from "@/types/report.type";
import { Eye } from "lucide-react";
import { Link } from "react-router";

interface ReportActionCellProps {
  report: MonthlyRevenue;
}

export const ReportActionCell = ({ report }: ReportActionCellProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link to={`/reports/${report.id}?month=${report.month}`}>
          <Eye className="h4 w4" />
        </Link>
      </Button>
    </div>
  );
};
