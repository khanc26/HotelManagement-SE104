import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams } from "react-router-dom";

const ROOM_TYPES = ["A", "B", "C"] as const;

const roomSchema = z.object({
  room_name: z
    .string()
    .min(2, { message: "Room name must be at least 2 characters." }),
  room_type: z.enum(["A", "B", "C"]),
  price: z.coerce
    .number()
    .min(0, { message: "Price must be greater than or equal to 0" }),
  status: z.enum(["available", "occupied", "inactive"]),
});

export function RoomEdit() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("id");
  console.log(roomId);
  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_name: "",
      room_type: "A",
      price: 0,
      status: "available",
    },
  });

  function onSubmit(values: z.infer<typeof roomSchema>) {
    console.log(values);
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Add New Room</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="room_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="">Select type</option>
                        {ROOM_TYPES.map((type) => (
                          <option key={type} value={type}>
                            Type {type}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Type of the room (e.g. A, B, C)
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
                        <option value="">Select status</option>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </FormControl>
                    <FormDescription>
                      Current status of the room
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Update Room
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
