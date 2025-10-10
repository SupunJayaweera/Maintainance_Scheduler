import type { TaskStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import { toast } from "sonner";

export const TaskStatusSelector = ({
  status,
  taskId,
}: {
  status: TaskStatus;
  taskId: string;
}) => {
  const { mutate, isPending } = useUpdateTaskStatusMutation();

  const handleStatusChange = (value: string) => {
    mutate(
      { taskId, status: value as TaskStatus },
      {
        onSuccess: () => {
          toast.success("Status updated successfully");
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
    <Select value={status || ""} onValueChange={handleStatusChange}>
      <SelectTrigger
        className="w-[180px] bg-slate-700/50 border-slate-600/50 text-white"
        disabled={isPending}
      >
        <SelectValue placeholder="Select status" />
      </SelectTrigger>

      <SelectContent className="bg-slate-800 border-slate-700">
        <SelectItem value="To Do" className="text-white hover:bg-slate-700">
          Scheduled
        </SelectItem>
        <SelectItem
          value="In Progress"
          className="text-white hover:bg-slate-700"
        >
          In Progress
        </SelectItem>
        <SelectItem value="Done" className="text-white hover:bg-slate-700">
          Completed
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
