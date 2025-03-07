import { DataTable } from "@/components/ui/data-table";
import { Room, roomColumns } from "./room-columns";
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

const roomsData: Room[] = [
  {
    id: "1",
    name: "Deluxe Suite",
    type: "Suite",
    price: 200,
    note: "Ocean view",
    status: "occupied",
  },
  {
    id: "2",
    name: "Standard Room",
    type: "Single",
    price: 100,
    note: undefined,
    status: "available",
  },
  {
    id: "3",
    name: "Family Room",
    type: "Double",
    price: 150,
    note: "Extra bed available",
    status: "available",
  },
  {
    id: "4",
    name: "Penthouse",
    type: "Suite",
    price: 500,
    note: "Private pool",
    status: "occupied",
  },
  {
    id: "5",
    name: "Budget Room",
    type: "Single",
    price: 50,
    note: "No air conditioning",
    status: "unknown",
  },
];

const roomSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Room name must be at least 2 characters." })
    .optional(),
  price: z
    .string()
    .transform((v) => Number(v) || 0)
    .refine((v) => v >= 1, {
      message: "Price must be at least 1",
    })
    .optional(),
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
      name: "",
      price: 1,
      location: "",
    },
  });

  function onSearch(values: z.infer<typeof roomSchema>) {
    const filteredRooms = roomsData.filter((room) => {
      return (
        (values.name
          ? room.name.toLowerCase().includes(values.name.toLowerCase())
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
                name="name"
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
