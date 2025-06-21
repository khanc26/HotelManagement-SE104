import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { roomColumns } from "./room-columns";
import { Room } from "@/types/room.type";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/api/rooms";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "lucide-react";

interface RoomPickerInputProps {
  value?: { id: string; roomNumber: string };
  onChange?: (value: { id: string; roomNumber: string }) => void;
  placeholder?: string;
}

export function RoomPickerInput({
  value,
  onChange,
  placeholder,
}: RoomPickerInputProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([]);

  // Fetch rooms inside the component
  const {
    data: rooms = [],
    isLoading: isRoomsLoading,
    isError: isRoomsError,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRooms(),
  });

  const handleRowSelectionChange = (rowSelection: Record<string, boolean>) => {
    const selected = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => rooms[Number(key)]);

    setSelectedRooms(selected);
  };

  const handleSelect = () => {
    if (selectedRooms.length > 0) {
      onChange?.({
        id: selectedRooms[0].id,
        roomNumber: selectedRooms[0].roomNumber,
      });
      setIsDialogOpen(false);
    }
  };

  const selectionColumns = [
    {
      id: "select",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: { row: any }) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
            className="peer hidden"
            disabled={row.original.status !== "available"}
          />
          <div className="w-5 h-5 border-2 border-black rounded bg-white peer-checked:bg-black transition-colors" />
        </label>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...roomColumns,
  ];

  return (
    <>
      <div className="relative w-full">
        <Input
          readOnly
          value={value?.roomNumber || ""}
          onClick={() => setIsDialogOpen(true)}
          placeholder={placeholder}
          className="cursor-pointer pr-10"
        />
        <Menu
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={18}
        />
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-[80%]">
          <DialogHeader>
            <DialogTitle>Select a Room</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {isRoomsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : isRoomsError ? (
              <div className="text-red-500">Failed to load rooms</div>
            ) : (
              <DataTable
                columns={selectionColumns}
                data={rooms}
                onRowSelectionChange={handleRowSelectionChange}
              />
            )}
          </div>
          <DialogFooter>
            {selectedRooms.length > 1 && (
              <p className="text-sm text-red-500 mt-2">
                You can only select one room.
              </p>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSelect}
              disabled={selectedRooms.length === 0 || selectedRooms.length > 1}
              title="Can only select one room"
            >
              Select
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
