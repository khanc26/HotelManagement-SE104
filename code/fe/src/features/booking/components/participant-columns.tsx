import { ColumnDef } from "@tanstack/react-table";
import {  ParticipantResponse } from "@/types/booking.type";

export const columns: ColumnDef<ParticipantResponse>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "profile.fullName",
    header: "Full Name",
  },
  {
    accessorKey: "profile.address",
    header: "Address",
  },
  {
    accessorKey: "profile.identityNumber",
    header: "Identity Number",
  },
  // {
  //   accessorKey: "userType",
  //   header: "User Type",
  //   cell: ({ row }) => {
  //     const userType = row.getValue("userType") as string;
  //     return userType.charAt(0).toUpperCase() + userType.slice(1);
  //   },
  // },
]; 