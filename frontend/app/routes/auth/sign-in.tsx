import { signInSchema } from "@/lib/schema";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2, Settings, Shield, User } from "lucide-react";
import { useAuth } from "@/provider/auth-context";

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const { login } = useAuth();

  const { mutate, isPending } = useLoginMutation();

  const handleOnSubmit = (values: SignInFormData) => {
    mutate(values, {
      onSuccess: (data) => {
        // Handle successful login
        login(data);
        console.log(data);
        toast.success("Login successful!");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || "Error signing in";
        console.error(error);
        // Show error message to user
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Logo Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">MaintenancePro</h1>
          <p className="text-slate-400 text-sm">Industrial IoT Platform</p>
        </div>
      </div>

      <Card className="max-w-md w-full bg-slate-800/50 backdrop-blur-md border-slate-700/50 shadow-2xl">
        <CardHeader className="text-center mb-5">
          <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-blue-400" />
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-slate-300">
            Sign in to access your industrial maintenance dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-white">Password</FormLabel>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>
          <CardFooter className="pt-6">
            <div className="text-center w-full">
              <div className="text-sm text-slate-400 mb-4">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </div>
              <div className="border-t border-slate-700/50 pt-4">
                <p className="text-xs text-slate-500">
                  Secure access to industrial maintenance systems
                </p>
              </div>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
