import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateTaskMutation } from "@/hooks/use-task";
import { createTaskSchema } from "@/lib/schema";
import type { ProjectMemberRole, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectMembers: { user: User; role: ProjectMemberRole }[];
}

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export const CreateTaskDialog = ({
  open,
  onOpenChange,
  projectId,
  projectMembers,
}: CreateTaskDialogProps) => {
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignees: [],
    },
  });

  const { mutate, isPending } = useCreateTaskMutation();

  const onSubmit = (values: CreateTaskFormData) => {
    mutate(
      {
        projectId,
        taskData: values,
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800/95 backdrop-blur-md border-slate-700/50">
        <DialogHeader>
          <DialogTitle className="text-white">
            Create Maintenance Task
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">
                        Task Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Replace pump bearings, Calibrate pressure gauge, Inspect safety valves"
                          className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50"
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
                        Task Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the maintenance procedure, safety requirements, tools needed, and expected completion criteria..."
                          className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">
                          Task Status
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormItem>
                              <FormControl>
                                <SelectTrigger className="w-full bg-slate-700/50 border-slate-600/50 text-white">
                                  <SelectValue placeholder="Select work status" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem
                                  value="To Do"
                                  className="text-white hover:bg-slate-700"
                                >
                                  Scheduled
                                </SelectItem>
                                <SelectItem
                                  value="In Progress"
                                  className="text-white hover:bg-slate-700"
                                >
                                  In Progress
                                </SelectItem>
                                <SelectItem
                                  value="Done"
                                  className="text-white hover:bg-slate-700"
                                >
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </FormItem>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">
                          Priority Level
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormItem>
                              <FormControl>
                                <SelectTrigger className="w-full bg-slate-700/50 border-slate-600/50 text-white">
                                  <SelectValue placeholder="Select urgency" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem
                                  value="Low"
                                  className="text-white hover:bg-slate-700"
                                >
                                  Routine
                                </SelectItem>
                                <SelectItem
                                  value="Medium"
                                  className="text-white hover:bg-slate-700"
                                >
                                  Standard
                                </SelectItem>
                                <SelectItem
                                  value="High"
                                  className="text-white hover:bg-slate-700"
                                >
                                  Critical
                                </SelectItem>
                              </SelectContent>
                            </FormItem>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">
                        Target Completion Date
                      </FormLabel>
                      <FormControl>
                        <Popover modal={true}>
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
                                format(new Date(field.value), "PPPP")
                              ) : (
                                <span>Select completion deadline</span>
                              )}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="bg-slate-800 border-slate-700">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) => {
                                field.onChange(
                                  date?.toISOString() || undefined
                                );
                              }}
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
                  name="assignees"
                  render={({ field }) => {
                    const selectedMembers = field.value || [];

                    return (
                      <FormItem>
                        <FormLabel className="text-slate-200">
                          Assigned Technicians
                        </FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal min-h-11 bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                              >
                                {selectedMembers.length === 0 ? (
                                  <span className="text-slate-400">
                                    Assign maintenance staff
                                  </span>
                                ) : selectedMembers.length <= 2 ? (
                                  selectedMembers
                                    .map((m) => {
                                      const member = projectMembers.find(
                                        (wm) => wm.user._id === m
                                      );
                                      return `${member?.user.name}`;
                                    })
                                    .join(", ")
                                ) : (
                                  `${selectedMembers.length} technicians assigned`
                                )}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent
                              className="w-sm max-h-60 overflow-y-auto p-2 bg-slate-800 border-slate-700"
                              align="start"
                            >
                              <div className="flex flex-col gap-2">
                                {projectMembers.map((member) => {
                                  const selectedMember = selectedMembers.find(
                                    (m) => m === member.user?._id
                                  );
                                  return (
                                    <div
                                      key={member.user._id}
                                      className="flex items-center gap-2 p-2 border border-slate-600/50 rounded bg-slate-700/30"
                                    >
                                      <Checkbox
                                        checked={!!selectedMember}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange([
                                              ...selectedMembers,

                                              member.user._id,
                                            ]);
                                          } else {
                                            field.onChange(
                                              selectedMembers.filter(
                                                (m) => m !== member.user._id
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
              </div>
            </div>

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
                {isPending ? "Creating Task..." : "Create Maintenance Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
