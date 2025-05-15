"use client";

import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
    fullName: z.string().min(1, {
      message: "Your name can't be empty.",
    }),
    nationality: z.string().min(1, {
      message: "Nationality can't be empty.",
    }),
    dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date",
    }),
    phoneNumber: z.string().min(10, {
      message: "Phone number must be at least 10 characters.",
    }),
    address: z.string().min(1, {
      message: "Address can't be empty.",
    }),
    identityNumber: z.string().min(1, {
      message: "Identity number can't be empty.",
    }),
    userType: z.enum(["foreign", "local"], {
      message: "Please choose a valid user type.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords didn't match",
    path: ["confirmPassword"],
  });

const SignUpPage = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      nationality: "",
      dob: "",
      phoneNumber: "",
      address: "",
      identityNumber: "",
      userType: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/sign-up`,
        {
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          nationality: values.nationality,
          dob: new Date(values.dob),
          phoneNumber: values.phoneNumber,
          address: values.address,
          identityNumber: values.identityNumber,
          userTypeName: values.userType,
        }
      );

      if (response.status === 201) {
        toast.success("Successfully sign up!");
        navigate("/auth/sign-in");
      }
    } catch (error) {
      toast.error("An error has occured!");
      console.error(error);
    }
  }

  return (
    <div className="mx-auto md:px-6 px-2 flex flex-col md:gap-6 gap-3">
      <div className="flex flex-col text-center items-center">
        <h2 className="text-2xl font-bold text-center">SIGN UP</h2>

        <p className="text-gray-600 text-center">
          Create an account to start managing reservations, guests, and hotel
          services.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col md:gap-4 gap-2 w-full mx-auto"
        >
          <p className="italic font-medium text-center">
            Your Account Information
          </p>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe01@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your password here..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your password..."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <p className="italic font-medium text-center">
            Your Details Information
          </p>

          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="flex-1">
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
              name="nationality"
              render={({ field }) => (
                <FormItem className="flex-1">
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
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="0393873631" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your address" {...field} />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-2">
            <FormField
              control={form.control}
              name="identityNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identity Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your identity number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
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
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-fit mx-auto" color="primary">
            Sign Up
          </Button>
          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignUpPage;
