import { getUsers } from "@/api/users";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSearchRequest, UserType } from "@/types/user.type";
import { GetAPIErrorResponseData } from "@/utils/helpers/getAPIErrorResponseData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { userColumns } from "./user-columns";

const userSchema = z.object({
  fullname: z.string().trim().optional(),
  role: z.enum(["admin", "user"]).optional(),
  email: z.string().trim().optional(),
  address: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  guest_type: z.enum(["local", "foreign"]).optional(),
  identity_number: z.string().trim().optional(),
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
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Role</SelectLabel>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="user">User</SelectItem>
                            </SelectGroup>
                          </SelectContent>
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
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full select-none">
                            <SelectValue placeholder="Select a guest type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Guest type</SelectLabel>
                              <SelectItem value="foreign">Foreign</SelectItem>
                              <SelectItem value="local">Local</SelectItem>
                            </SelectGroup>
                          </SelectContent>
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
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">
                                In Active
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
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
                <Button type="submit" color="primary">
                  Search
                </Button>

                <Button type="button" color="primary" onClick={clearFilters}>
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
