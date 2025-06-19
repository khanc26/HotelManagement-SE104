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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Room, RoomUpdateRequest } from "@/types/room.type";
import { getRoom, updateRoom } from "@/api/rooms";
import { getRoomTypes } from "@/api/room-types";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import React from "react";
import { CardContentSkeleton } from "@/components/card-content-skeleton";
import { CardContentError } from "@/components/card-content-error";

const roomSchema = z.object({
  roomNumber: z.string().trim().optional(),
  roomTypeId: z.string().trim().min(1, { message: "Please select a room type." }),
  note: z.string().trim().optional(),
  status: z.enum(["available", "occupied"]).optional(),
});

export function RoomEdit() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const roomId = searchParams.get("id");

  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: "",
      roomTypeId: "",
      note: "",
      status: undefined,
    },
  });

  const {
    data: roomTypes,
    isLoading: isRoomTypesLoading,
    isError: isRoomTypesError,
  } = useQuery({
    queryKey: ["roomTypes"],
    queryFn: getRoomTypes,
  });

  const {
    data: room,
    isLoading: isRoomLoading,
    isError: isRoomError,
  } = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoom(roomId!),
  });

  React.useEffect(() => {
    console.log(room);
    if (room) {
      form.reset({
        roomNumber: room.roomNumber || "",
        roomTypeId: room.roomType?.id || "",
        note: room.note || "",
        status: room.status || undefined,
      });
    }
  }, [room, form]);

  const mutation = useMutation({
    mutationFn: ({
      id,
      updatedRoom,
    }: {
      id: string;
      updatedRoom: RoomUpdateRequest;
    }) => updateRoom(id, updatedRoom),
    onSuccess: (data: Room) => {
      console.log("Room updated successfully", data);
      toast.success("Room updated successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms", roomId] });
    },
    onError: (error: unknown) => {
      console.error("Error updating room", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to update room: ${errorMessage}`);
    },
    // Optional: Add loading state handling
    onMutate: () => {
      console.log("Starting room update...");
    },
  });

  function onSubmit(values: z.infer<typeof roomSchema>) {
    if (!roomId) {
      // console.error("Room ID is required");
      toast.error("Room ID is required");
      return;
    }

    const updatedRoom: RoomUpdateRequest = {
      roomNumber: values.roomNumber || undefined,
      roomTypeId: values.roomTypeId,
      note: values.note || "",
      status: values.status || undefined,
    };

    mutation.mutate({ id: roomId, updatedRoom });
  }

  // Loading state
  if (isRoomLoading || isRoomTypesLoading) {
    return (
      <div className="flex justify-center items-center">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>Edit Room</CardTitle>
          </CardHeader>
          <CardContent>
            <CardContentSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isRoomError || isRoomTypesError) {
    return (
      <div className="flex justify-center items-center">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>Edit Room</CardTitle>
          </CardHeader>
          <CardContent>
            <CardContentError errorMessage={`Error loading room data.`} />
          </CardContent>
        </Card>
      </div>
    );
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
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Room Name" {...field} disabled />
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
                name="roomTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 disabled:opacity-80 disabled:text-gray-500"
                        disabled
                      >
                        <option value="">All Types</option>
                        {roomTypes?.map((type) => (
                          <option key={type.id} value={type.id}>
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
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input placeholder="Note ..." {...field} />
                    </FormControl>
                    <FormDescription>Short note for this room.</FormDescription>
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 disabled:opacity-80 disabled:text-gray-500"
                        disabled
                      >
                        <option value="">Select status</option>
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
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Room"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
