import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { set } from "zod";
import { ArrowLeft, CheckCircle, Loader, XCircle } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Verify Email</h1>
      {/* <p>
        {isVerifying ? "Verifying email..." : "Email verified successfully!"}
      </p> */}
      <Card className="w-full max-w-md">
        {/* <CardHeader>
          <Link to="/sign-in" className="flex items-center gap-2 text-sm">
            {" "}
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
          </Link>
        </CardHeader> */}

        <CardContent>
          <div className="flex flex-col items-center justify-center">
            {isVerifying ? (
              <>
                <Loader className="w-10 h-10 text-gray-500 animate-spin mb-4" />
                <h3 className="text-lg font-semibold">Verifying email...</h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify your email address.
                </p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-10 h-10 text-green-500 mb-4" />
                <h1 className="text-lg font-semibold">Email Verified</h1>
                <p className="text-sm text-gray-500">
                  Your email has been verified successfully!
                </p>
                <Link
                  to="/sign-in"
                  className="flex items-center gap-2 mt-3 text-sm"
                >
                  <Button variant="outline">Back to Sign In</Button>
                </Link>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10 text-red-500 mb-4" />
                <h1 className="text-lg font-semibold">Verification Failed</h1>
                <p className="text-sm text-gray-500">
                  Email verification failed. Please try again.
                </p>

                <Link
                  to="/sign-in"
                  className="flex items-center gap-2 mt-3 text-sm"
                >
                  <Button variant="outline">Back to Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
