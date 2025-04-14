import { Button } from "@/components/ui/button";

import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Booking } from "@/types/booking.type";

export function BookingActionCell({ booking }: { booking: Booking }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link to={`/bookings/${booking.id}`}>
          <Eye className="h4 w4" />
        </Link>
      </Button>
    </div>
  );
}
