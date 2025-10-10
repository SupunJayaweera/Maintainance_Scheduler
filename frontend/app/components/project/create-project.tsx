import { projectSchema } from "@/lib/schema";
import { ProjectStatus, type MemberProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { UseCreateProject } from "@/hooks/use-projects";
import { toast } from "sonner";
import { is } from "date-fns/locale";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  workspaceMembers: MemberProps[];
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

const CreateProjectDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
  workspaceMembers,
}: CreateProjectDialogProps) => {
  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      status: ProjectStatus.PLANNING,
      startDate: "",
      dueDate: "",
      members: [],
      tags: undefined,
    },
  });

  const { mutate, isPending } = UseCreateProject();

  const onSubmit = (values: CreateProjectFormData) => {
    if (!workspaceId) return;

    mutate(
      {
        projectData: values,
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || "Error creating project";
          toast.error(errorMessage);
          console.log("Error creating project:", error);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] bg-slate-800/95 backdrop-blur-md border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="text-white">
            Create a Maintenance Job
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Create a new maintenance project to organize equipment service tasks
            and schedule preventive maintenance activities
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    Maintenance Job Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Equipment Inspection, Pump Maintenance, Safety Check"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    Job Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the maintenance procedures, equipment involved, and expected outcomes..."
                      className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    Maintenance Status
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full bg-slate-700/50 border-slate-600/50 text-white">
                        <SelectValue placeholder="Select maintenance phase" />
                      </SelectTrigger>

                      <SelectContent className="bg-slate-800 border-slate-700">
                        {Object.values(ProjectStatus).map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-white hover:bg-slate-700"
                          >
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">
                      Maintenance Start Date
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={
                              "w-full justify-start text-left font-normal bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50" +
                              (!field.value ? " text-slate-400" : "")
                            }
                          >
                            <CalendarIcon className="size-4 mr-2" />
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Select start date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? date.toISOString().split("T")[0] : ""
                              )
                            }
                            initialFocus
                            className="bg-slate-800 text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">
                      Target Completion Date
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={
                              "w-full justify-start text-left font-normal bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50" +
                              (!field.value ? " text-slate-400" : "")
                            }
                          >
                            <CalendarIcon className="size-4 mr-2" />
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Select due date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? date.toISOString().split("T")[0] : ""
                              )
                            }
                            initialFocus
                            className="bg-slate-800 text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    Equipment Tags (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Pump, HVAC, Electrical, Critical (comma separated)"
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
              name="members"
              render={({ field }) => {
                const selectedMembers = field.value || [];
                return (
                  <FormItem>
                    <FormLabel className="text-slate-200">
                      Technicians & Team (Optional)
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="w-full justify-start text-left font-normal min-h-11 bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                          >
                            {selectedMembers.length === 0 ? (
                              <span className="text-slate-400">
                                Select maintenance team
                              </span>
                            ) : selectedMembers.length <= 2 ? (
                              selectedMembers.map((m) => {
                                const member = workspaceMembers.find(
                                  (wm) => wm.user._id === m.user
                                );
                                return `${member?.user.name} (${member?.role})`;
                              })
                            ) : (
                              `${selectedMembers.length} team members selected`
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full max-w-60 overflow-y-auto bg-slate-800 border-slate-700"
                          align="start"
                        >
                          <div className="flex flex-col gap-2">
                            {workspaceMembers.map((member) => {
                              const selectedMember = selectedMembers.find(
                                (m) => m.user === member.user._id
                              );

                              return (
                                <div
                                  key={member._id}
                                  className="flex items-center gap-2 p-2 border border-slate-600/50 rounded bg-slate-700/30"
                                >
                                  <Checkbox
                                    checked={!!selectedMember}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([
                                          ...selectedMembers,
                                          {
                                            user: member.user._id,
                                            role: "contributor",
                                          },
                                        ]);
                                      } else {
                                        field.onChange(
                                          selectedMembers.filter(
                                            (m) => m.user !== member.user._id
                                          )
                                        );
                                      }
                                    }}
                                    id={`member-${member.user._id}`}
                                    className="data-[state=checked]:bg-blue-600 border-slate-500"
                                  />
                                  <span className="truncate flex-1 text-white">
                                    {member.user.name}
                                  </span>

                                  {selectedMember && (
                                    <Select
                                      value={selectedMember.role}
                                      onValueChange={(role) => {
                                        field.onChange(
                                          selectedMembers.map((m) =>
                                            m.user === member.user._id
                                              ? {
                                                  ...m,
                                                  role: role as
                                                    | "contributor"
                                                    | "manager"
                                                    | "viewer",
                                                }
                                              : m
                                          )
                                        );
                                      }}
                                    >
                                      <SelectTrigger className="h-8 text-xs bg-slate-600/50 border-slate-500 text-white">
                                        <SelectValue placeholder="Role" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem
                                          value="manager"
                                          className="text-white hover:bg-slate-700"
                                        >
                                          Supervisor
                                        </SelectItem>
                                        <SelectItem
                                          value="contributor"
                                          className="text-white hover:bg-slate-700"
                                        >
                                          Technician
                                        </SelectItem>
                                        <SelectItem
                                          value="viewer"
                                          className="text-white hover:bg-slate-700"
                                        >
                                          Observer
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
              >
                {isPending ? "Creating Job..." : "Create Maintenance Job"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
