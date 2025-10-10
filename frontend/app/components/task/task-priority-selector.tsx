import type { TaskPriority, TaskStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  useUpdateTaskPriorityMutation,
  useUpdateTaskStatusMutation,
} from "@/hooks/use-task";
import { toast } from "sonner";

export const TaskPrioritySelector = ({
  priority,
  taskId,
}: {
  priority: TaskPriority;
  taskId: string;
}) => {
  const { mutate, isPending } = useUpdateTaskPriorityMutation();

  const handleStatusChange = (value: string) => {
    mutate(
      { taskId, priority: value as TaskPriority },
      {
        onSuccess: () => {
          toast.success("Priority updated successfully");
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
    <Select value={priority || ""} onValueChange={handleStatusChange}>
      <SelectTrigger
        className="w-[180px] bg-slate-700/50 border-slate-600/50 text-white"
        disabled={isPending}
      >
        <SelectValue placeholder="Select priority" />
      </SelectTrigger>

      <SelectContent className="bg-slate-800 border-slate-700">
        <SelectItem value="Low" className="text-white hover:bg-slate-700">
          Routine
        </SelectItem>
        <SelectItem value="Medium" className="text-white hover:bg-slate-700">
          Standard
        </SelectItem>
        <SelectItem value="High" className="text-white hover:bg-slate-700">
          Critical
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
