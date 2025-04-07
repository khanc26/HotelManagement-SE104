"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
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
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 6 characters.",
  }),
});

const SignInPage = () => {
  const navigate = useNavigate();

  const [, setAccessTokenValue] = useLocalStorage("access_token", null);

  const [, setRoleLocalStorage] = useLocalStorage("role", null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        "http://localhost:3001/auth/sign-in",
        {
          email: values.username,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );

      console.dir(response);

      const access_token = response.data.accessToken;
      const role = response.data.role;
      setAccessTokenValue(access_token);
      setRoleLocalStorage(role);

      toast.success("Sign in successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("An error has occured"!);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormDescription>This is your unique username.</FormDescription>
                <FormMessage />
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
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Make sure your password is secure.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div className="space-y-2 text-center text-sm">
            <p>
              Don't have an account?{" "}
              <Link
                to="/auth/sign-up"
                className="text-blue-600 hover:underline"
              >
                Sign up here
              </Link>
            </p>
            <p>
              <Link
                to="/auth/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot your password?
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInPage;
