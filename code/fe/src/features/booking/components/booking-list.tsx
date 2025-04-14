import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/api/bookings";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./booking-columns";

export function BookingList() {
  const { data, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">List of Bookings</CardTitle>
      </CardHeader>
      <div className="flex">
        <CardContent className="flex-1 w-1">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <DataTable columns={columns} data={data || []} />
          )}
        </CardContent>
      </div>
    </Card>
  );
}
