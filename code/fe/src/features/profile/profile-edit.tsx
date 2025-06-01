import { getMyProfile } from "@/api/profile";
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
import { UserUpdateRequest } from "@/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
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
  }).optional(),
});

export function ProfileEdit() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });

  const userId = searchParams.get("id") || profile?.id;

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

  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.profile.fullName || "",
        email: profile.email || "",
        address: profile.profile.address || "",
        nationality: profile.profile.nationality || "",
        phoneNumber: profile.profile.phoneNumber || "",
        identityNumber: profile.profile.identityNumber || "",
        status: profile.profile.status || "",
        dob: profile.profile.dob
          ? new Date(profile.profile.dob).toISOString().split("T")[0]
          : "",
      });
    }
  }, [profile, form]);

  const mutation = useMutation({
    mutationFn: ({ id, updatedUser }: { id: string; updatedUser: UserUpdateRequest }) =>
      updateUser(id, updatedUser),
    onSuccess: () => {
      toast.success("Profile updated successfully", {
        position: "top-right",
        autoClose: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    const updatedUser: UserUpdateRequest = {
      fullName: values.fullName || undefined,
      email: values.email || undefined,
      address: values.address || undefined,
      nationality: values.nationality || undefined,
      phoneNumber: values.phoneNumber || undefined,
      identityNumber: values.identityNumber || undefined,
      status: values.status || undefined,
      dob: values.dob ? new Date(values.dob) : undefined,
    };

    mutation.mutate({ id: userId, updatedUser });
  });

  return (
    <Card className="w-full h-full mb-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading profile</div>
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "fullName", label: "Full Name", desc: "Your complete name" },
                  { name: "email", label: "Email", desc: "Valid email address", type: "email" },
                  { name: "address", label: "Address", desc: "Your current address" },
                  { name: "nationality", label: "Nationality", desc: "Your nationality" },
                  { name: "phoneNumber", label: "Phone Number", desc: "Format: +84..." },
                  { name: "identityNumber", label: "Identity Number", desc: "Personal ID number" },
                  { name: "dob", label: "Date of Birth", desc: "Your birth date", type: "date" },
                ].map(({ name, label, desc, type = "text" }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name as keyof z.infer<typeof userSchema>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input
                            type={type}
                            {...field}
                            disabled={mutation.isPending}
                          />
                        </FormControl>
                        <FormDescription>{desc}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          disabled={mutation.isPending}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="">Select status</option>
                          <option value="active">active</option>
                          <option value="inactive">inactive</option>
                        </select>
                      </FormControl>
                      <FormDescription>User activity status</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Update Profile"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
