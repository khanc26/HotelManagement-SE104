import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Role, UserType } from "@/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { z } from "zod";

const USER_TYPES = ["foreign", "local"] as const;
const USER_ROLE = ["admin", "user"] as const;

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

export const UserEdit = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  console.log(userId);

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
  function onSubmit(values: z.infer<typeof userSchema>) {
    console.log(values);
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the user name" {...field} />
                    </FormControl>
                    <FormDescription>Type the full name</FormDescription>
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
                        <option value="">Select role</option>
                        {USER_ROLE.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>Type the role</FormDescription>
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
                        {USER_TYPES.map((type) => (
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Update User
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
