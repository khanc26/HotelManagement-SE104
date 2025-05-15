import {
  BookingDetailsApprovalStatus,
  BookingDetailsStatus,
} from "@/types/booking-detail";

export const bookingStatusStyleMap: Record<
  BookingDetailsStatus,
  { label: string; className: string }
> = {
  [BookingDetailsStatus.PENDING]: {
    label: "Pending",
    className: "bg-blue-100 text-blue-800 border border-blue-300",
  },
  [BookingDetailsStatus.CHECKED_IN]: {
    label: "Checked In",
    className: "bg-green-100 text-green-800 border border-green-300",
  },
  [BookingDetailsStatus.CHECKED_OUT]: {
    label: "Checked Out",
    className: "bg-gray-100 text-gray-800 border border-gray-300",
  },
  [BookingDetailsStatus.CANCELLED]: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border border-red-300",
  },
};

export const approvalStatusStyleMap: Record<
  BookingDetailsApprovalStatus,
  { label: string; className: string }
> = {
  [BookingDetailsApprovalStatus.PENDING]: {
    label: "Pending",
    className: "bg-blue-100 text-blue-800 border border-blue-300",
  },
  [BookingDetailsApprovalStatus.CONFIRMED]: {
    label: "Confirmed",
    className: "bg-green-100 text-green-800 border border-green-300",
  },
  [BookingDetailsApprovalStatus.CANCELLED]: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border border-red-300",
  },
};
