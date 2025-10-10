import type { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { inviteMemberSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Check, Copy, Mail } from "lucide-react";
import { Label } from "../ui/label";
import { useInviteMemberMutation } from "@/hooks/use-workspace";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}
export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

const ROLES = ["admin", "member", "viewer"] as const;

export const InviteMemberDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
}: InviteMemberDialogProps) => {
  const [inviteTab, setInviteTab] = useState("email");
  const [linkCopied, setLinkCopied] = useState(false);

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const { mutate, isPending } = useInviteMemberMutation();

  const onSubmit = async (data: InviteMemberFormData) => {
    if (!workspaceId) return;

    mutate(
      {
        workspaceId,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Invite sent successfully");
          form.reset();
          setInviteTab("email");
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
          console.log(error);
        },
      }
    );
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/workspace-invite/${workspaceId}`
    );
    setLinkCopied(true);

    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800/95 backdrop-blur-md border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="text-white">Invite Team Members</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="email"
          value={inviteTab}
          onValueChange={setInviteTab}
        >
          <TabsList className="bg-slate-700/50 border-slate-600/50">
            <TabsTrigger
              value="email"
              disabled={isPending}
              className="text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              Send Email
            </TabsTrigger>
            <TabsTrigger
              value="link"
              disabled={isPending}
              className="text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
            >
              Share Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-6 w-full">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">
                              Technician Email Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="technician@company.com"
                                className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-200">
                              Access Level
                            </FormLabel>
                            <FormControl>
                              <div className="flex gap-3 flex-wrap">
                                {ROLES.map((role) => (
                                  <label
                                    key={role}
                                    className="flex items-center cursor-pointer gap-2 text-slate-200"
                                  >
                                    <input
                                      type="radio"
                                      value={role}
                                      className="peer hidden"
                                      checked={field.value === role}
                                      onChange={() => field.onChange(role)}
                                    />
                                    <span
                                      className={cn(
                                        "w-7 h-7 rounded-full border-2 border-slate-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg bg-slate-700/50",
                                        field.value === role &&
                                          "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-800 border-blue-500 bg-blue-600/50"
                                      )}
                                    >
                                      {field.value === role && (
                                        <span className="w-3 h-3 rounded-full bg-white" />
                                      )}
                                    </span>
                                    <span className="capitalize">
                                      {role === "admin"
                                        ? "Supervisor"
                                        : role === "member"
                                          ? "Technician"
                                          : "Observer"}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                      size={"lg"}
                      disabled={isPending}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {isPending ? "Sending Invite..." : "Send Team Invite"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-slate-200">
                  Share this link to invite team members
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/workspace-invite/${workspaceId}`}
                    className="bg-slate-700/50 border-slate-600/50 text-white"
                  />
                  <Button
                    onClick={handleCopyInviteLink}
                    disabled={isPending}
                    className="bg-slate-600/50 hover:bg-slate-500/50 text-white border-slate-500"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Anyone with this link can join the maintenance workspace as a
                team member
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
