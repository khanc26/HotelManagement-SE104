"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLocation, useNavigate } from "react-router-dom";

const formSchema = z.object({
  otp: z.string().length(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });
  // values: z.infer<typeof formSchema>
  async function onSubmit() {
    // try {
    //   const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/auth/verify-otp`, {
    //     email,
    //     otp: values.otp,
    //   });

    //   if (response.status === 200) {
        navigate("/auth/reset-password", { 
          state: { email, token: "123" } 
        });
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
      <p className="text-center text-gray-600 mb-6">
        Enter the 6-digit code sent to your email.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the verification code sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Verify Code
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VerifyOTPPage; 