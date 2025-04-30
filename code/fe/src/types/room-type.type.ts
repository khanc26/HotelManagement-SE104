// src/types/room-type.type.ts

import { Room } from "./room.type";

// Enum để xác định tên các loại phòng
export enum RoomTypeName {
  A = "A",
  B = "B",
  C = "C",
}

// Interface cho RoomType (Loại phòng)
export interface RoomType {
  id: string; // ID của loại phòng
  name: RoomTypeName; // Tên loại phòng (A, B, C)
  description?: string; // Mô tả loại phòng (optional)
  roomPrice: number; // Giá của loại phòng
  maxGuests?: number; // Sức chứa tối đa (optional)
  rooms?: Room[]; // Danh sách các phòng thuộc loại phòng này (optional)
  createdAt: Date; // Thời gian tạo loại phòng
  updatedAt: Date; // Thời gian cập nhật loại phòng
  deletedAt?: Date | null; // Thời gian xóa loại phòng (optional)
}

// Interface cho yêu cầu tạo mới loại phòng (RoomTypeCreateRequest)
export interface RoomTypeCreateRequest {
  name: RoomTypeName; // Tên loại phòng
  description?: string; // Mô tả loại phòng (optional)
  roomPrice: number; // Giá của loại phòng
  maxGuests?: number; // Sức chứa tối đa (optional)
  // Các thuộc tính khác nếu cần thiết
}

// Interface cho yêu cầu cập nhật loại phòng (RoomTypeUpdateRequest)
export interface RoomTypeUpdateRequest {
  name?: RoomTypeName; // Tên loại phòng (optional)
  description?: string; // Mô tả loại phòng (optional)
  roomPrice?: number; // Giá của loại phòng (optional)
  maxGuests?: number; // Sức chứa tối đa (optional)
  // Các thuộc tính khác nếu cần thiết
}
