import { BackButton } from "@/components/back-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  IndustrialPageLayout,
  IndustrialCard,
  IndustrialLoading,
} from "@/components/layout/industrial-page-layout";
import {
  useChangePassword,
  useUpdateUserProfile,
  useUserProfileQuery,
} from "@/hooks/use-user";

import { useAuth } from "@/provider/auth-context";
import type { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader, Loader2, User as UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z.string().min(8, { message: "New password is required" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const profileSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  profilePicture: z.string().optional(),
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { data: user, isPending } = useUserProfileQuery() as {
    data: User;
    isPending: boolean;
  };
  const { logout } = useAuth();
  const navigate = useNavigate();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      profilePicture: user?.profilePicture || "",
    },
    values: {
      name: user?.name || "",
      profilePicture: user?.profilePicture || "",
    },
  });

  const { mutate: updateUserProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();
  const {
    mutate: changePassword,
    isPending: isChangingPassword,
    error,
  } = useChangePassword();

  const handlePasswordChange = (values: ChangePasswordFormData) => {
    changePassword(values, {
      onSuccess: () => {
        toast.success(
          "Password updated successfully. You will be logged out. Please login again."
        );
        form.reset();

        setTimeout(() => {
          logout();
          navigate("/sign-in");
        }, 3000);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.error || "Failed to update password";
        toast.error(errorMessage);
        console.log(error);
      },
    });
  };

  const handleProfileFormSubmit = (values: ProfileFormData) => {
    updateUserProfile(
      { name: values.name, profilePicture: values.profilePicture || "" },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.error || "Failed to update profile";
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  if (isPending) {
    return <IndustrialLoading message="Loading profile settings..." />;
  }

  return (
    <IndustrialPageLayout
      title="Profile Settings"
      subtitle="Manage your account information and security settings"
      icon={UserIcon}
    >
      <div className="space-y-6">
        <IndustrialCard>
          <CardHeader>
            <CardTitle className="text-slate-200 font-semibold">
              Personal Information
            </CardTitle>
            <CardDescription className="text-slate-400">
              Update your personal details and profile settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(handleProfileFormSubmit)}
                className="grid gap-4"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20 bg-slate-700 ring-2 ring-slate-600">
                    <AvatarImage
                      src={
                        profileForm.watch("profilePicture") ||
                        user?.profilePicture
                      }
                      alt={user?.name}
                    />
                    <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      // onChange={handleAvatarChange}
                      // disabled={uploading || isUpdatingProfile}
                      style={{ display: "none" }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                      // disabled={uploading || isUpdatingProfile}
                    >
                      Change Avatar
                    </Button>
                  </div>
                </div>
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-200 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email}
                    disabled
                    className="bg-slate-800/50 border-slate-600/30 text-slate-400"
                  />
                  <p className="text-xs text-slate-500">
                    Your email address cannot be changed for security reasons.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-fit bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  disabled={isUpdatingProfile || isPending}
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </IndustrialCard>

        <IndustrialCard>
          <CardHeader>
            <CardTitle className="text-slate-200 font-semibold">
              Security Settings
            </CardTitle>
            <CardDescription className="text-slate-400">
              Update your password and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handlePasswordChange)}
                className="grid gap-4"
              >
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200 font-medium">
                          Current Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="current-password"
                            type="password"
                            placeholder="Enter current password"
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
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200 font-medium">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="new-password"
                            type="password"
                            placeholder="Enter new password"
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
                            id="confirm-password"
                            placeholder="Confirm new password"
                            type="password"
                            className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="mt-2 w-fit bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  disabled={isPending || isChangingPassword}
                >
                  {isPending || isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </IndustrialCard>
      </div>
    </IndustrialPageLayout>
  );
};

export default Profile;
