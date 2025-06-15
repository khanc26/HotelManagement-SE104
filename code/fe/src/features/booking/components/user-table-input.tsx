import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { UserType } from "@/types/user.type";
import { Participant } from "@/types/booking.type";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/api/profile";
import { getConfiguration } from "@/api/configurations";
import { Plus, User } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useRef } from "react";

interface Configuration {
  id: string;
  paramName: string;
  paramValue: number;
  description: string;
  createdAt: string;
  deletedAt: string | null;
}

interface UserTableInputProps {
  value?: Participant[];
  onChange?: (value: Participant[]) => void;
  notUser?: boolean
}

export function UserTableInput({
  value = [],
  onChange,
  notUser = false
}: UserTableInputProps) {
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    data: myProfile,
    isLoading: isProfileLoading,
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });

  const { data: configuration } = useQuery<Configuration[]>({
    queryKey: ["configuration"],
    queryFn: getConfiguration,
  });

  const maxUsers = configuration?.find((c: Configuration) => c.paramName === 'max_guests_per_room')?.paramValue || 3;

  // Check if current user is already added as a participant
  const isSelfAdded = myProfile && value.some(
    (participant) => participant.email === myProfile.email
  );

  const handleAddSelf = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!myProfile || value.length >= maxUsers || isSelfAdded) return;
    
    const newParticipant: Participant = {
      email: myProfile.email,
      fullName: myProfile.profile.fullName,
      address: myProfile.profile.address,
      identityNumber: myProfile.profile.identityNumber,
      userType: myProfile.userType.typeName,
    };

    onChange?.([...value, newParticipant]);
  };

  const handleAddPerson = (e: React.MouseEvent) => {
    e.preventDefault();
    if (value.length >= maxUsers) return;
    
    onChange?.([
      ...value,
      {
        email: "",
        fullName: "",
        address: "",
        identityNumber: "",
        userType: UserType.LOCAL,
      },
    ]);
  };

  const handleRemoveUser = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const updatedValue = [...value];
    updatedValue.splice(index, 1);
    onChange?.(updatedValue);
  };

  const handleUserChange = (
    index: number,
    field: keyof Participant,
    fieldValue: string | UserType
  ) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      const updatedValue = [...value];
      updatedValue[index] = {
        ...updatedValue[index],
        [field]: fieldValue,
      };
      onChange?.(updatedValue);
    }, 100);
  };

  const participantColumns: ColumnDef<Participant>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const isSelf = myProfile && row.original.email === myProfile.email;
        return (
          <Input
            defaultValue={row.original.email}
            onBlur={(e) => handleUserChange(row.index, "email", e.target.value)}
            placeholder="Enter email"
            disabled={isSelf}
          />
        );
      },
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => {
        const isSelf = myProfile && row.original.email === myProfile.email;
        return (
          <Input
            defaultValue={row.original.fullName}
            onBlur={(e) => handleUserChange(row.index, "fullName", e.target.value)}
            placeholder="Enter full name"
            disabled={isSelf}
          />
        );
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const isSelf = myProfile && row.original.email === myProfile.email;
        return (
          <Input
            defaultValue={row.original.address}
            onBlur={(e) => handleUserChange(row.index, "address", e.target.value)}
            placeholder="Enter address"
            disabled={isSelf}
          />
        );
      },
    },
    {
      accessorKey: "identityNumber",
      header: "Identity Number",
      cell: ({ row }) => {
        const isSelf = myProfile && row.original.email === myProfile.email;
        return (
          <Input
            defaultValue={row.original.identityNumber}
            onBlur={(e) => handleUserChange(row.index, "identityNumber", e.target.value)}
            placeholder="Enter identity number"
            disabled={isSelf}
          />
        );
      },
    },
    {
      accessorKey: "userType",
      header: "User Type",
      cell: ({ row }) => {
        const isSelf = myProfile && row.original.email === myProfile.email;
        return (
          <select
            defaultValue={row.original.userType}
            onChange={(e) => handleUserChange(row.index, "userType", e.target.value as UserType)}
            className="w-full p-2 border rounded"
            disabled={isSelf}
          >
            <option value={UserType.LOCAL}>Local</option>
            <option value={UserType.FOREIGN}>Foreign</option>
          </select>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => handleRemoveUser(e, row.index)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Participants</h3>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSelf}
            disabled={notUser || value.length >= maxUsers || isProfileLoading || isSelfAdded}
          >
            <User className="h-4 w-4 mr-2" />
            Add Myself
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPerson}
            disabled={value.length >= maxUsers}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Person
          </Button>
        </div>
      </div>

      <DataTable
        columns={participantColumns}
        data={value}
      />
    </div>
  );
} 