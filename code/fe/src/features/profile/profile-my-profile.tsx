import { getMyProfile } from "@/api/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function MyProfile() {
  const form = useForm({
    defaultValues: {
      fullname: "",
      role: "",
      email: "",
      address: "",
      nationality: "",
      guest_type: "",
      identity_number: "",
      status: "",
      dob: "",
    },
  });

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getMyProfile(),
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullname: user.profile.fullName || "",
        role: user.role.roleName || "",
        email: user.email || "",
        address: user.profile.address || "",
        nationality: user.profile.nationality || "",
        guest_type: user.userType.typeName || "",
        identity_number: user.profile.identityNumber || "",
        status: user.profile.status || "",
        dob: user.profile.dob
          ? new Date(user.profile.dob).toISOString().split("T")[0]
          : "",
      });
    }
  }, [user, form]);

  return (
    <Card className="w-full h-full mb-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>An error has occurred!</div>
        ) : (
          <div className="flex">
            <div className="w-1 flex-1">
              <Form {...form}>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="fullname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              className="font-semibold"
                            />
                          </FormControl>
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
                            <Input
                              {...field}
                              disabled
                              className="font-semibold"
                            />
                          </FormControl>
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
                              {...field}
                              disabled
                              className="font-semibold"
                            />
                          </FormControl>
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
                            <Input
                              {...field}
                              disabled
                              className="font-semibold"
                            />
                          </FormControl>
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
                            <Input
                              {...field}
                              disabled
                              className="font-semibold"
                            />
                          </FormControl>
                          <FormMessage />
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
                            <Input
                              {...field}
                              disabled
                              className="font-semibold"
                            />
                          </FormControl>
                          <FormMessage />
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
                            <Input
                              {...field}
                              disabled
                              className="font-semibold"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              className="font-semibold"
                            />
                          </FormControl>
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
                              {...field}
                              disabled
                              className="font-semibold"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
