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
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RoomCreateRequest } from "@/types/room.type";
import { createRoom } from "@/api/rooms";
import { getRoomTypes } from "@/api/room-types";
import { GetAPIErrorResponseData } from "@/utils/helpers/getAPIErrorResponseData";
import { toast } from "react-toastify";

const roomSchema = z.object({
  roomNumber: z.string().min(1, { message: "Room number is required" }),
  roomTypeId: z.string().min(1, { message: "Room type is required" }),
  note: z.string().optional(),
});

export function RoomAddNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: "",
      roomTypeId: "",
      note: "",
    },
  });

  const {
    data: roomTypes,
    isError: isRoomTypesError,
    error: roomTypesError,
  } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
  });

  if (isRoomTypesError) {
    const errorData = GetAPIErrorResponseData(roomTypesError);
    if (errorData.statusCode === 401) {
      toast.error("Unauthorized. Navigating to sign-in page in 3 seconds");
      setTimeout(() => {
        navigate("/auth/sign-in");
      }, 3000);
    } else
      toast.error(
        "Error while getting room types " +
          errorData.statusCode +
          " " +
          errorData.message
      );
  }

  const mutation = useMutation({
    mutationFn: (newRoom: RoomCreateRequest) => createRoom(newRoom),
    onSuccess: () => {
      toast.success("Room created successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      navigate("/rooms/list");
    },
    onError: (error: unknown) => {
      console.error("Error creating room", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to create room: ${errorMessage}`);
    },
  });

  function onSubmit(values: z.infer<typeof roomSchema>) {
    const newRoom: RoomCreateRequest = {
      roomNumber: values.roomNumber,
      roomTypeId: values.roomTypeId,
      note: values.note || "",
    };

    mutation.mutate(newRoom);
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
                name="roomTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="">Select type</option>
                        {roomTypes?.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>Type of the room</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input placeholder="Note" {...field} />
                    </FormControl>
                    <FormDescription>
                      Additional notes about the room
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
