import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  getRoomTypes,
  deleteRoomType,
  updateRoomType,
} from "@/api/room-types";
import { RoomType } from "@/types/room-type.type";

const RoomTypeList = () => {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const data = await getRoomTypes();
        setRoomTypes(data);
      } catch (error) {
        console.error("Failed to fetch room types", error);
      }
    };

    fetchRoomTypes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteRoomType(id);
      setRoomTypes((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleEditPrice = async (id: string) => {
    const newPrice = prompt("New Price:");
    if (newPrice && !isNaN(Number(newPrice))) {
      try {
        const updated = await updateRoomType(id, {
          roomPrice: Number(newPrice),
        });
        setRoomTypes((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, roomPrice: updated.roomPrice } : r
          )
        );
      } catch (error) {
        console.error("Update failed", error);
      }
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-semibold">Room Type List</h2>
        </div>

        {/* Table */}
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3">ID</th>
              <th className="p-3">Room Type</th>
              <th className="p-3">Price (VND)</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.length > 0 ? (
              roomTypes.map((room) => (
                <tr key={room.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{room.id}</td>
                  <td className="p-3">{room.name}</td>
                  <td className="p-3">
                    {room.roomPrice.toLocaleString("vi-VN")}
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => handleEditPrice(room.id)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDelete(room.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3" colSpan={4}>
                  No room types found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTypeList;
