import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  Loader,
  XCircle,
  Settings,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/hooks/use-auth";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate, isPending: isVerifying } = useVerifyEmailMutation();

  useEffect(() => {
    const token = searchParams.get("token");
    // console.log("Token from URL:", token);
    if (token) {
      mutate(
        { token },
        {
          onSuccess: () => {
            setIsSuccess(true);
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message || "Error verifying email";
            setIsSuccess(false);
            console.log(error);

            toast.error(errorMessage);
          },
        }
      );
    }
  }, [searchParams]);
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
            <Mail className="h-6 w-6 text-blue-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">
              Email Verification
            </h2>
          </div>
          <p className="text-slate-400">Confirming your account access</p>
        </div>

        <Card className="shadow-2xl border-slate-700/50 bg-slate-800/90 backdrop-blur-sm">
          <CardContent className="pt-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-6">
              {isVerifying ? (
                <>
                  <div className="bg-blue-500/20 p-4 rounded-full mb-4">
                    <Loader className="w-12 h-12 text-blue-400 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Verifying Email...
                  </h3>
                  <p className="text-slate-400 max-w-sm">
                    Please wait while we verify your email address for secure
                    access to industrial systems.
                  </p>
                </>
              ) : isSuccess ? (
                <>
                  <div className="bg-green-500/20 p-4 rounded-full mb-4">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Email Verified!
                  </h3>
                  <p className="text-slate-400 max-w-sm">
                    Your email has been verified successfully. You now have
                    access to MaintenancePro.
                  </p>
                  <Link
                    to="/sign-in"
                    className="inline-flex items-center justify-center mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                  >
                    Continue to Sign In
                  </Link>
                </>
              ) : (
                <>
                  <div className="bg-red-500/20 p-4 rounded-full mb-4">
                    <XCircle className="w-12 h-12 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Verification Failed
                  </h3>
                  <p className="text-slate-400 max-w-sm">
                    Email verification failed. The link may be expired or
                    invalid.
                  </p>
                  <Link
                    to="/sign-in"
                    className="inline-flex items-center justify-center mt-4 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium rounded-lg transition-all duration-200"
                  >
                    Back to Sign In
                  </Link>
                </>
              )}

              <div className="pt-6 mt-6 border-t border-slate-700/50 w-full">
                <p className="text-xs text-slate-500">
                  Secure email verification for industrial maintenance systems
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
