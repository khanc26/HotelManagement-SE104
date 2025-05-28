import { DataTable } from "@/components/ui/data-table";
import { RoomTypeColumns } from "./room-type-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getRoomTypes } from "@/api/room-types";
import { GetAPIErrorResponseData } from "@/utils/helpers/getAPIErrorResponseData";
import { toast } from "react-toastify";

export default function RoomTypeList() {
  const {
    data: roomTypes,
    isLoading: isRoomTypesLoading,
    isError: isRoomTypesError,
    error: roomTypesError,
  } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
  });

  if (isRoomTypesError) {
    const errorData = GetAPIErrorResponseData(roomTypesError);
    toast.error(
      "Error while getting room types " +
        errorData.statusCode +
        " " +
        errorData.message
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Table Data */}
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Room Types List</CardTitle>
        </CardHeader>
        <div className="flex">
          <CardContent className="flex-1 w-1">
            {isRoomTypesLoading ? (
              <div>Loading...</div>
            ) : isRoomTypesError ? (
              <div>An error has occurred!</div>
            ) : (
              <DataTable columns={RoomTypeColumns} data={roomTypes || []} />
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
