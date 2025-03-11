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
import { Room } from "../types/room.types";

const roomsData: Room[] = [
  {
    id: "1",
    room_name: "Deluxe Suite",
    room_type: "A",
    price: 200,
    status: "occupied",
  },
  {
    id: "2",
    room_name: "Standard Room",
    room_type: "B",
    price: 100,
    status: "available",
  },
  {
    id: "3",
    room_name: "Family Room",
    room_type: "A",
    price: 150,
    status: "available",
  },
  {
    id: "4",
    room_name: "Penthouse",
    room_type: "C",
    price: 500,
    status: "occupied",
  },
  {
    id: "5",
    room_name: "Budget Room",
    room_type: "C",
    price: 50,
    status: "inactive",
  },
];

const roomSchema = z.object({
  room_name: z
    .string()
    .min(2, { message: "Room room_name must be at least 2 characters." })
    .optional(),
  price: z.coerce.number().optional(),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters." })
    .optional(),
});

export function RoomList() {
  const [data, setData] = useState(roomsData);

  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_name: "",
      price: 1,
      location: "",
    },
  });

  function onSearch(values: z.infer<typeof roomSchema>) {
    const filteredRooms = roomsData.filter((room) => {
      return (
        (values.room_name
          ? room.room_name
              .toLowerCase()
              .includes(values.room_name.toLowerCase())
          : true) && (values.price ? room.price >= Number(values.price) : true)
      );
    });

    setData(filteredRooms);
  }

  return (
    <div>
      <p className="text-3xl font-bold mb-6">Rooms Management</p>

      {/* Search Form */}
      <Card className="w-full h-full mb-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Search room</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4">
              <FormField
                control={form.control}
                name="room_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Room Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name of the room.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Room price"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of people this room can hold.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Room Location" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where this room is located.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Search
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Table Data */}
      <Card className="w-full h-full mb-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">List of room</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={roomColumns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
