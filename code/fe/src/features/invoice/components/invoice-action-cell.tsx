import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

import { Link } from "react-router-dom";
import { Invoice } from "@/types/invoice.type";

export function InvoiceActionCell({ invoice }: { invoice: Invoice }) {

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link to={`/invoices/${invoice.id}`}>
          <Eye className="h4 w4" />
        </Link>
      </Button>
    </div>
  );
}
