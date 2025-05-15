import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { RoomType } from "@/types/room-type.type";
import { deleteRoomType } from "@/api/room-types";

export function RoomActionsCell({ roomType }: { roomType: RoomType }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (roomTypeId: string) => deleteRoomType(roomTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
      console.log(`Room type ${roomType.name} deleted successfully`);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error deleting room type:", errorMessage);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(roomType.id);
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to={`/room-types/edit?id=${roomType.id}`}>
              <p className="text-sm font-normal">Edit</p>
            </Link>
          </DropdownMenuItem>

          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Delete
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            <span className="font-semibold inline text-black underline">
              {roomType.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
