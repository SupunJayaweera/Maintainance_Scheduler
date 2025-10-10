import { signUpSchema } from "@/lib/schema";
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
import { useSignUpMutation } from "@/hooks/use-auth";
import { toast } from "sonner";
import { UserPlus, Settings } from "lucide-react";

export type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useSignUpMutation();

  const handleOnSubmit = (values: SignUpFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Email verification Required!", {
          description: "Please check your email to verify your account.",
        });

        form.reset();
        navigate("/sign-in");
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        console.log(error);
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

      <Card className="max-w-md w-full shadow-2xl border-slate-700/50 bg-slate-800/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex items-center justify-center mb-2">
            <UserPlus className="h-6 w-6 text-blue-400 mr-2" />
            <CardTitle className="text-2xl font-bold text-white">
              Create Account
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Join our industrial maintenance platform
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
                    <FormLabel className="text-slate-200 font-medium">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your work email"
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 font-medium">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
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
                    <FormLabel className="text-slate-200 font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a secure password"
                        className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
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
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
          <CardFooter className="pt-6">
            <div className="text-center w-full">
              <div className="text-sm text-slate-400 mb-4">
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  className="text-blue-400 hover:text-blue-300 hover:underline font-medium"
                >
                  Sign In
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

export default SignUp;
