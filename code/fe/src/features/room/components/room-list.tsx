import { getRoomTypes } from "@/api/room-types";
import { getRooms } from "@/api/rooms";
import { TableError } from "@/components/table-error";
import { TableSkeleton } from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RoomRequest } from "@/types/room.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { roomColumns } from "./room-columns";
import { RoomPDFDocument } from "./room-pdf-document";

const roomSchema = z.object({
  roomNumber: z.string().trim().trim().optional(),
  roomType: z.string().trim().trim().optional(),
  price: z.string().optional(),
  status: z.enum(["available", "occupied", ""]).optional(),
});

export function RoomList() {
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
  } = useQuery({
    queryKey: ["rooms", searchParams],
    queryFn: () => getRooms(searchParams),
  });

  const {
    data: roomTypes,
    isLoading: isRoomTypesLoading,
    isError: isRoomTypesError,
  } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
  });

  async function onSearch(values: z.infer<typeof roomSchema>) {
    const params: RoomRequest = {
      roomNumber: values.roomNumber || undefined,
      roomType: values.roomType || undefined,
      price:
      values.price && values.price.trim() !== ""
        ? Number(values.price)
        : undefined,
      status: values.status || undefined,
    };
    setSearchParams((prev) => {
      return { ...prev, ...params };
    });
  }

  const clearFilters = () => {
    form.reset({
      roomNumber: "",
      roomType: "",
      price: "",
      status: "",
    });
    setSearchParams({});
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto">
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
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">List of room</CardTitle>
          {rooms && (
            <PDFDownloadLink
              key={Date.now()}
              document={<RoomPDFDocument rooms={rooms} />}
              fileName="room-list.pdf"
            >
              {({ loading }) => (
                <Button variant="outline" disabled={loading}>
                  <Printer className="mr-2 h-4 w-4" />
                  {loading ? "Generating PDF..." : "Print PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          )}
        </CardHeader>
        <div className="flex">
          <CardContent className="flex-1 w-1">
            {isRoomsLoading || isRoomTypesLoading ? (
              <TableSkeleton />
            ) : isRoomsError || isRoomTypesError ? (
              <TableError />
            ) : (
              <DataTable columns={roomColumns} data={rooms || []} />
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
