export type Room = {
  id: string;
  room_name: string;
  room_type: "A" | "B" | "C";
  price: number;
  status: "inactive" | "occupied" | "available";
};
