import { Checkbox } from "@/components/ui/checkbox";
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
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { access_token_expired_time } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password can't be empty.",
  }),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const [, setAccessTokenValue] = useLocalStorage("access_token", null);
  const [, setRoleLocalStorage] = useLocalStorage("role", null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/sign-in`,
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
        }
      );

      const access_token = response.data.accessToken;
      const role = response.data.role;
      setAccessTokenValue(access_token, access_token_expired_time);
      setRoleLocalStorage(role, access_token_expired_time);

      navigate("/");

      toast.success("Signed in successfully!", {
        position: "bottom-right",
      });
    } catch (err: any) {
      console.error(err);
      toast.success("Signed in successfully!", {
        position: "bottom-right",
      });
    }

    return (
      <div className="mx-auto md:px-6 px-2 flex flex-col md:gap-6 gap-3">
        <div className="flex flex-col text-center items-center">
          <h2 className="text-2xl font-bold text-center">SIGN IN</h2>
          <p className="text-gray-600 text-center">
            Sign in to manage reservations, guests, and hotel services
            efficiently.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col md:gap-4 gap-2 md:w-2/3 w-full mx-auto"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="johndoe01@gmail.com" />
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

            <div className="flex items-center justify-between">
              <p>
                <Link
                  to="/auth/forgot-password"
                  className="hover:text-blue-600 transition-all hover:underline text-sm"
                >
                  Forgot your password?
                </Link>
              </p>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm select-none">
                  Remember me
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm select-none">
                  Remember me
                </label>
              </div>
            </div>

            <Button type="submit" className="w-fit mx-auto" color="primary">
              Sign In
            </Button>
            <Button type="submit" className="w-fit mx-auto" color="primary">
              Sign In
            </Button>

            <div className="space-y-2 text-center text-sm">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/auth/sign-up"
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    );
  }
};

export default SignInPage;
