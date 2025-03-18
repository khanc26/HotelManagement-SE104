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
import { Role, User, UserType } from "@/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userColumns } from "./user-columns";

const usersData: User[] = [
  {
    id: "1",
    fullname: "Minh Nguyen",
    role: Role.ADMIN,
    email: "minh@gmail.com",
    address: "tp hcm, quan 10",
    nationality: "Vietnam",
    user_type: UserType.LOCAL,
    dob: new Date("1995-07-15").toLocaleDateString(),
    phone_number: "09234234324",
    identity_number: "12345522342",
  },
  {
    id: "2",
    fullname: "Nguyen Nguyen",
    role: Role.ADMIN,
    email: "minh@gmail.com",
    address: "tp hcm, quan 10",
    nationality: "Vietnam",
    user_type: UserType.LOCAL,
    dob: new Date("1995-07-15").toLocaleDateString(),
    phone_number: "09234234324",
    identity_number: "12345522342",
  },
  {
    id: "3",
    fullname: "An Nguyen",
    role: Role.ADMIN,
    email: "minh@gmail.com",
    address: "tp hcm, quan 10",
    nationality: "Vietnam",
    user_type: UserType.LOCAL,
    dob: new Date("1995-07-15").toLocaleDateString(),
    phone_number: "09234234324",
    identity_number: "12345522342",
  },
  {
    id: "4",
    fullname: "Tung Nguyen",
    role: Role.ADMIN,
    email: "minh@gmail.com",
    address: "tp hcm, quan 10",
    nationality: "Han quoc",
    user_type: UserType.LOCAL,
    dob: new Date("1995-07-15").toLocaleDateString(),
    phone_number: "09234234324",
    identity_number: "12345522342",
  },
  {
    id: "5",
    fullname: "Lionel Messi",
    role: Role.ADMIN,
    email: "messi@gmail.com",
    address: "tp hcm, quan 10",
    nationality: "Argentina",
    user_type: UserType.FOREIGN,
    dob: new Date("1995-07-15").toLocaleDateString(),
    phone_number: "09234234324",
    identity_number: "12345522342",
  },
  {
    id: "6",
    fullname: "Bruno Mars",
    role: Role.ADMIN,
    email: "minh@gmail.com",
    address: "tp hcm, quan 10",
    nationality: "Mars",
    user_type: UserType.FOREIGN,
    dob: new Date("1995-07-15").toLocaleDateString(),
    phone_number: "09234234324",
    identity_number: "12345522342",
  },
];

const userSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters."),
  role: z.enum(["admin", "user"]),
  email: z.string().email("Invalid email format."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  nationality: z.string().min(2, "Nationality must be specified."),
  guest_type: z.enum(["foreign", "local"]),
  phone_number: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number."),
  identity_number: z
    .string()
    .min(5, "Identity number must be at least 5 characters."),
  status: z.enum(["active", "deleted"]),
  dob: z.coerce.date().refine((date) => date <= new Date(), {
    message: "Date of birth must be in the past.",
  }),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  deleted_at: z.coerce.date().nullable().optional(),
});

export function UserList() {
  const [data, setData] = useState(usersData);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullname: "",
      role: Role.USER,
      email: "",
      address: "",
      nationality: "",
      guest_type: UserType.LOCAL,
      phone_number: "",
      identity_number: "",
      status: "active",
      dob: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
  });

  function onSearch(values: z.infer<typeof userSchema>) {
    const filteredUsers = usersData.filter((user) => {
      return (
        (values.fullname
          ? user.fullname.toLowerCase().includes(values.fullname.toLowerCase())
          : true) &&
        (values.role
          ? user.email.toLowerCase().includes(values.email.toLowerCase())
          : true)
      );
    });

    setData(filteredUsers);
  }

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
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone_number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the phone_number" {...field} />
                    </FormControl>
                    <FormDescription>
                      The phone number must be in the format +84..
                    </FormDescription>
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
                        <option value="deleted">deleted</option>
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
                      <Input
                        type="date"
                        value={field.value?.toISOString().split("T")[0]}
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Search
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full h-full mb-4">
        <CardHeader>
          <CardTitle className="text-xl font-bold">List of room</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <div className="w-1 flex-1">
              <DataTable columns={userColumns} data={data} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
