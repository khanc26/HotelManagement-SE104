import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

export function InvoiceActionsCell({ bookingId }: { bookingId: string }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link to={`/invoices/${bookingId}`}>
          <Eye className="h4 w4" />
        </Link>
      </Button>
    </div>
  );
}
