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
import { RoomTypeCreateRequest, RoomTypeName } from "@/types/room-type.type";
import { createRoomType } from "@/api/room-types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const roomTypeSchema = z.object({
  name: z.nativeEnum(RoomTypeName, {
    errorMap: () => ({ message: "Please select a valid room type" }),
  }),
  price: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z
      .number({ invalid_type_error: "Price must be a number" })
      .min(0, "Price must be greater than or equal to 0")
  ),
});

type RoomTypeForm = z.infer<typeof roomTypeSchema>;

export function RoomTypeAdd() {
  const queryClient = useQueryClient();

  const form = useForm<RoomTypeForm>({
    resolver: zodResolver(roomTypeSchema),
    defaultValues: {
      name: undefined,
      price: 0,
    },
  });

  const onSubmit = async (values: RoomTypeForm) => {
    const roomTypeData: RoomTypeCreateRequest = {
      name: values.name,
      roomPrice: values.price,
    };

    try {
      await createRoomType(roomTypeData);
      toast.success("Room type added successfully!");
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
      form.reset();
    } catch (error) {
      console.error("Failed to add room type", error);
      toast.error("Failed to add room type.");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Add New Room Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type Name</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="">Please select a room type</option>
                        <option value={RoomTypeName.A}>A</option>
                        <option value={RoomTypeName.B}>B</option>
                        <option value={RoomTypeName.C}>C</option>
                      </select>
                    </FormControl>
                    <FormDescription>Type of room category</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (VND)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter price" {...field} />
                    </FormControl>
                    <FormDescription>Price of the room type</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Add Room Type
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RoomTypeAdd;
