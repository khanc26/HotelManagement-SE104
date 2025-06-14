import { ColumnDef } from "@tanstack/react-table";
import { Participant } from "@/types/booking.type";

export const columns: ColumnDef<Participant>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "identityNumber",
    header: "Identity Number",
  },
  {
    accessorKey: "userType",
    header: "User Type",
    cell: ({ row }) => {
      const userType = row.getValue("userType") as string;
      return userType.charAt(0).toUpperCase() + userType.slice(1);
    },
  },
]; 