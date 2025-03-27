import { useEffect, useState } from "react";
import { roomTypesColumns } from "../features/room/components/room-type-columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const RoomTypePage = () => {
  const [roomTypes, setRoomTypes] = useState([
    { id: "1", name: "Deluxe Suite", category: "Luxury", price: 200, status: "available" },
    { id: "2", name: "Standard Room", category: "Budget", price: 100, status: "available" },
  ]);
  useEffect(() => {
    // Giả lập gọi API lấy dữ liệu room types
    fetch("/api/room-types")
      .then((res) => res.json())
      .then((data) => setRoomTypes(data))
      .catch((err) => console.error("Error fetching room types:", err));
  }, []);
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Room Types</h1>
        <Button asChild>
          <Link to="/room-types/create">Add New Room Type</Link>
        </Button>
      </div>
      <DataTable columns={roomTypesColumns} data={roomTypes} />
    </div>
  );
};

export default RoomTypePage;