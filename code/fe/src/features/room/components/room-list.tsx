import { DataTable } from "@/components/ui/data-table";
import { roomColumns } from "./room-columns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/api/rooms";
import { getRoomTypes } from "@/api/room-types";
import { GetAPIErrorResponseData } from "@/utils/helpers/getAPIErrorResponseData";
import { toast } from "sonner";
import { RoomRequest } from "@/types/room.type";
import { useNavigate } from "react-router-dom";

const roomSchema = z.object({
  roomNumber: z.string().optional(),
  roomType: z.string().optional(),
  price: z.number().optional(),
  status: z.enum(["available", "occupied"]).optional(),
});

export function RoomList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<RoomRequest>({});

  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: "",
      roomType: "",
      price: undefined,
      status: undefined,
    },
  });

  const {
    data: rooms,
    isLoading: isRoomsLoading,
    isError: isRoomsError,
    error: roomsError,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRooms(searchParams),
  });

  const {
    data: roomTypes,
    isLoading: isRoomTypesLoading,
    isError: isRoomTypesError,
    error: roomTypesError,
  } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
  });

  if (isRoomsError) {
    const errorData = GetAPIErrorResponseData(roomsError);
    if (errorData.statusCode === 401) {
      toast.error("Unauthorized. Navigating to sign-in page in 3 seconds");
      setTimeout(() => {
        navigate("/auth/sign-in");
      }, 3000);
    } else
      toast.error(
        "Error while getting rooms " +
          errorData.statusCode +
          " " +
          errorData.message
      );
  }

  if (isRoomTypesError) {
    const errorData = GetAPIErrorResponseData(roomTypesError);
    toast.error(
      "Error while getting room types " +
        errorData.statusCode +
        " " +
        errorData.message
    );
  }

  async function onSearch(values: z.infer<typeof roomSchema>) {
    const params: RoomRequest = {
      roomNumber: values.roomNumber || undefined,
      roomType: values.roomType || undefined,
      price: values.price || undefined,
      status: values.status || undefined,
    };
    setSearchParams({ ...params });
    refetchRooms();
  }

  const clearFilters = () => {
    form.reset({
      roomNumber: "",
      roomType: "",
      price: undefined,
      status: undefined,
    });
    setSearchParams({});
    refetchRooms();
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>Room Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="roomNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Room Number" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the number of the room.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="">All Types</option>
                          {roomTypes?.map((type) => (
                            <option key={type.id} value={type.name}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>Room types (A, B, C).</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Room Price"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Price per night for this room.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Status</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="">All Status</option>
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Current status of the room
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Table Data */}
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">List of room</CardTitle>
        </CardHeader>
        <div className="flex">
          <CardContent className="flex-1 w-1">
            {isRoomsLoading || isRoomTypesLoading ? (
              <div>Loading...</div>
            ) : isRoomsError || isRoomTypesError ? (
              <div>An error has occurred!</div>
            ) : (
              <DataTable columns={roomColumns} data={rooms || []} />
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
