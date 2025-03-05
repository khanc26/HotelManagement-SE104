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

const roomSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Room name must be at least 2 characters." }),
  capacity: z.number().min(1, { message: "Capacity must be at least 1." }),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters." }),
});

export function RoomAddNew() {
  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      capacity: 1,
      location: "",
    },
  });

  function onSubmit(values: z.infer<typeof roomSchema>) {
    console.log(values);
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Add New Room</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Room Capacity"
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
                Add Room
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
