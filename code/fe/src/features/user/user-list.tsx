import { getUsers } from "@/api/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Role, UserSearchRequest, UserType } from "@/types/user.type";
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
      role: Role.USER,
      email: "",
      address: "",
      nationality: "",
      guest_type: UserType.LOCAL,
      identity_number: "",
      status: "active",
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
    queryKey: ["users"],
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
    refetchUsers();
  }

  const clearFilters = () => {
    form.reset({
      fullname: "",
      role: Role.USER,
      email: "",
      address: "",
      nationality: "",
      guest_type: UserType.LOCAL,
      identity_number: "",
      status: "active",
      dob: undefined,
    });
    setSearchParams({});
    refetchUsers();
  };

  return (
    <div>
      <p className="text-3xl font-bold mb-6">Users Management</p>

      {/* Search Form */}
      <Card className="w-full h-full mb-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Search user</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSearch)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FullName</FormLabel>
                      <FormControl>
                        <Input placeholder="Fullname" {...field} />
                      </FormControl>
                      <FormDescription>This is the user name.</FormDescription>
                      <FormMessage />
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
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="">All Role</option>
                          {Object.values(Role).map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>This is the user role.</FormDescription>
                      <FormMessage />
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
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Valid email address</FormDescription>
                      <FormMessage />
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
                        <Input placeholder="Enter the address" {...field} />
                      </FormControl>
                      <FormDescription>
                        The address must include the city, district, and street
                      </FormDescription>
                      <FormMessage />
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
                        <Input placeholder="Enter the nationality" {...field} />
                      </FormControl>
                      <FormDescription>
                        The nationality must be specified
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="guest_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guest_type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="">Select type</option>
                          {Object.values(UserType).map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>Type the guest type</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="identity_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identity_number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the identity_number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The identity_number is important
                      </FormDescription>
                      <FormMessage />
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
                        <select
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="">Select status</option>
                          <option value="active">active</option>
                          <option value="inactive">inactive</option>
                        </select>
                      </FormControl>
                      <FormDescription>
                        Current status of the user
                      </FormDescription>
                      <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full mb-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">List of user</CardTitle>
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
    </div>
  );
}
