import { getUsers } from "@/api/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserSearchRequest, UserType } from "@/types/user.type";
import { roles, userStatus, userTypes } from "@/utils/constraints";
import { GetAPIErrorResponseData } from "@/utils/helpers/getAPIErrorResponseData";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { userColumns } from "./user-columns";

const userSchema = z.object({
  fullname: z.string().optional(),
  role: z.enum(["admin", "user"]).optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  nationality: z.string().optional(),
  guest_type: z.enum(["local", "foreign"]).optional(),
  identity_number: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  dob: z
    .string()
    .refine(
      (val) => {
        // Kiểm tra chuỗi có phải là ngày hợp lệ không (ví dụ: "YYYY-MM-DD")
        return !isNaN(new Date(val).getTime());
      },
      {
        message: "Invalid date format (expected YYYY-MM-DD)",
      }
    )
    .optional(),
});

export function UserList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState<UserSearchRequest>({});

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullname: "",
      role: undefined,
      email: "",
      address: "",
      nationality: "",
      guest_type: undefined,
      identity_number: "",
      status: undefined,
      dob: undefined,
    },
  });

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", searchParams],
    queryFn: () => getUsers(searchParams),
  });

  if (isUsersError) {
    const errorData = GetAPIErrorResponseData(usersError);
    if (errorData.statusCode === 401) {
      toast.error("Unauthorized. Navigating to sign-in page in 3 seconds");
      setTimeout(() => {
        navigate("/auth/sign-in");
      }, 3000);
    } else
      toast.error(
        "Error while getting rooms " +
          errorData.statusCode +
          " " +
          errorData.message
      );
  }

  async function onSearch(values: z.infer<typeof userSchema>) {
    const params: UserSearchRequest = {
      fullName: values.fullname || undefined,
      roleName: values.role || undefined,
      email: values.email || undefined,
      address: values.address || undefined,
      nationality: values.nationality || undefined,
      userTypeName: (values.guest_type as UserType) || undefined,
      status: values.status || undefined,
      identifyNumber: values.identity_number || undefined,
      dob: values.dob || undefined,
    };
    setSearchParams({ ...params });
  }

  const clearFilters = () => {
    form.reset({
      fullname: "",
      role: undefined,
      email: "",
      address: "",
      nationality: "",
      guest_type: undefined,
      identity_number: "",
      status: undefined,
      dob: undefined,
    });
    setSearchParams({});
    refetchUsers();
  };

  return (
    <>
      <p className="text-3xl font-bold mb-6">Users Management</p>

      {/* Search Form */}
      <Card className="w-full h-full mb-4 border-black/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Search User</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSearch)}
              className="flex flex-col md:gap-4 gap-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          items={roles}
                          {...field}
                          placeholder="Select role..."
                          defaultSelectedKeys={["user"]}
                        >
                          {(animal) => <SelectItem>{animal.label}</SelectItem>}
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe01@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main Street, London, England"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="England" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guest_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest Type</FormLabel>
                      <FormControl>
                        <Select
                          items={userTypes}
                          {...field}
                          defaultSelectedKeys={["local"]}
                          placeholder="Select user type..."
                        >
                          {(animal) => <SelectItem>{animal.label}</SelectItem>}
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="identity_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identity Number</FormLabel>
                      <FormControl>
                        <Input placeholder="123456789" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Status</FormLabel>
                      <FormControl>
                        <Select
                          items={userStatus}
                          {...field}
                          defaultSelectedKeys={["active"]}
                          placeholder="Select user status..."
                        >
                          {(animal) => <SelectItem>{animal.label}</SelectItem>}
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 items-center justify-center">
                <Button
                  type="submit"
                  color="primary"
                  startContent={<SearchIcon />}
                >
                  Search
                </Button>

                <Button
                  type="button"
                  color="primary"
                  onPress={clearFilters}
                  startContent={<TrashIcon />}
                >
                  Clear Filters
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full mb-4 border-black/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Users List</CardTitle>
        </CardHeader>
        <CardContent>
          {isUsersLoading ? (
            <div>Loading...</div>
          ) : isUsersError ? (
            <div>An error has occurred!</div>
          ) : (
            <div className="flex">
              <div className="w-1 flex-1">
                <DataTable columns={userColumns} data={users || []} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
