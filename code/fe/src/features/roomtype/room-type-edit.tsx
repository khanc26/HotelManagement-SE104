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
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoomTypes, updateRoomType } from "@/api/room-types";
import { RoomType, RoomTypeUpdateRequest } from "@/types/room-type.type";
import { toast } from "react-toastify";
import { useEffect } from "react";

const roomTypeSchema = z.object({
  name: z.string().trim().min(1, "Room type name is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+$/, "Price must be a number"),
});

export function RoomTypeEdit() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomTypeId = searchParams.get("id");

  const form = useForm<z.infer<typeof roomTypeSchema>>({
    resolver: zodResolver(roomTypeSchema),
    defaultValues: {
      name: "",
      price: "",
    },
  });

  const { data: roomTypes, isSuccess } = useQuery<RoomType[]>({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
    enabled: !!roomTypeId,
  });

  useEffect(() => {
    if (isSuccess && roomTypeId && roomTypes) {
      const found = roomTypes.find((rt) => rt.id === roomTypeId);
      if (found) {
        form.setValue("name", found.name);
        form.setValue("price", found.roomPrice.toString());
      } else {
        toast.error("Room type not found");
        navigate("/room-types");
      }
    }
  }, [isSuccess, roomTypeId, roomTypes, form, navigate]);

  const mutation = useMutation({
    mutationFn: ({
      id,
      updatedRoomType,
    }: {
      id: string;
      updatedRoomType: RoomTypeUpdateRequest;
    }) => updateRoomType(id, updatedRoomType),
    onSuccess: () => {
      toast.success("Room type updated successfully");
      queryClient.invalidateQueries({ queryKey: ["roomTypes"] });
      navigate("/room-types");
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to update room type: ${errorMessage}`);
    },
  });

  function onSubmit(values: z.infer<typeof roomTypeSchema>) {
    if (!roomTypeId) {
      toast.error("Room Type ID is required");
      return;
    }

    const updatedRoomType: RoomTypeUpdateRequest = {
      roomPrice: Number(values.price),
    };

    mutation.mutate({ id: roomTypeId, updatedRoomType });
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Edit Room Type</CardTitle>
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
                      <Input placeholder="Type name..." {...field} disabled />
                    </FormControl>
                    <FormDescription>This field cannot be changed</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter price..." {...field} />
                    </FormControl>
                    <FormDescription>Enter price in VND</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Update Room Type
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
