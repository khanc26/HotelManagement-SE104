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
import { Room, RoomUpdateRequest } from "@/types/room.type";
import { updateRoom } from "@/api/rooms";
import { getRoomTypes } from "@/api/room-types";
import { GetAPIErrorResponseData } from "@/utils/helpers/getAPIErrorResponseData";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const roomSchema = z.object({
  roomNumber: z.string().optional(),
  roomTypeId: z.string(),
  note: z.string().optional(),
  status: z.enum(["available", "occupied"]).optional(),
});

export function RoomEdit() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
    // isLoading: isRoomTypesLoading,
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
        "Error while getting rooms " +
          errorData.statusCode +
          " " +
          errorData.message
      );
  }

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
      // Optional: Add success toast
      toast.success("Room updated successfully");
      // Optional: Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: unknown) => {
      console.error("Error updating room", error);
      // Improved error handling
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      // Optional: Add error toast
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
                name="roomTypeId"
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
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
