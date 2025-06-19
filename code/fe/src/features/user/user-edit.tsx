import { updateUser } from "@/api/users";
import { Button } from "@/components/ui/button";
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
import { User, UserUpdateRequest } from "@/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const userSchema = z.object({
  fullName: z.string().trim().optional(),
  email: z.string().trim().optional(),
  address: z.string().trim().optional(),
  nationality: z.string().trim().optional(),
  phoneNumber: z.string().trim().optional(),
  identityNumber: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  dob: z.string().trim().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
});

export const UserEdit = () => {
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  console.log("update user id: ", userId);

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      nationality: "",
      phoneNumber: "",
      identityNumber: "",
      status: undefined,
      dob: "",
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      id,
      updatedUser,
    }: {
      id: string;
      updatedUser: UserUpdateRequest;
    }) => updateUser(id, updatedUser),
    onSuccess: (data: User) => {
      console.log("User updated successfully", data);
      // Optional: Add success toast
      toast.success("User updated successfully");
      // Optional: Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: unknown) => {
      console.error("Error updating room", error);
      // Improved error handling
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      // Optional: Add error toast
      toast.error(`Failed to update user: ${errorMessage}`);
    },
    // Optional: Add loading state handling
    onMutate: () => {
      console.log("Starting user update...");
    },
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    const updatedUser: UserUpdateRequest = {
      fullName: values.fullName || undefined,
      email: values.email || undefined,
      address: values.address || undefined,
      nationality: values.nationality || undefined,
      phoneNumber: values.phoneNumber || undefined,
      identityNumber: values.identityNumber || undefined,
      dob: new Date(values.dob),
    };

    mutation.mutate({ id: userId, updatedUser });
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Update User</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
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
                name="phoneNumber"
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
                name="identityNumber"
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
                        <option value="deleted">inactive</option>
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
