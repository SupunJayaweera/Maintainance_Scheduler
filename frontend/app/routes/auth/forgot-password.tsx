import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/hooks/use-auth";
import { forgotPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CircleCheck,
  Loader2,
  Settings,
  RotateCcw,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data, {
      onSuccess: () => {
        setIsSuccess(true);
        setIsLoading(false);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred. Please try again.";
        setIsSuccess(false);
        setIsLoading(false);
        console.log("Forgot Password Error:", error);
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Industrial Logo Section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg">
            <Settings className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">MaintenancePro</h1>
        <p className="text-slate-400 text-sm">
          Industrial Maintenance Management System
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-2">
            <RotateCcw className="h-6 w-6 text-blue-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          </div>
          <p className="text-slate-400">
            Enter your email address to reset your password
          </p>
        </div>

        <Card className="shadow-2xl border-slate-700/50 bg-slate-800/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <Link
              to="/sign-in"
              className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Sign In</span>
            </Link>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="bg-green-500/20 p-4 rounded-full mb-4">
                  <CircleCheck className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Reset Link Sent!
                </h3>
                <p className="text-slate-400 max-w-sm">
                  Check your email for instructions to reset your password. The
                  link will expire in 15 minutes.
                </p>
                <div className="pt-4 border-t border-slate-700/50 w-full">
                  <p className="text-xs text-slate-500">
                    Secure password recovery for industrial systems
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200 font-medium">
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your work email"
                              className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Sending Reset Link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="pt-6 mt-6 border-t border-slate-700/50 text-center">
                  <p className="text-xs text-slate-500">
                    Secure password recovery for industrial maintenance systems
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
