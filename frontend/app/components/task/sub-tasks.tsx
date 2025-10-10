import type { Subtask } from "@/types";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  useAddSubTaskMutation,
  useUpdateSubTaskMutation,
} from "@/hooks/use-task";
import { toast } from "sonner";

export const SubTasksDetails = ({
  subTasks,
  taskId,
}: {
  subTasks: Subtask[];
  taskId: string;
}) => {
  const [newSubTask, setNewSubTask] = useState("");
  const { mutate: addSubTask, isPending } = useAddSubTaskMutation();
  const { mutate: updateSubTask, isPending: isUpdating } =
    useUpdateSubTaskMutation();

  const handleToggleTask = (subTaskId: string, checked: boolean) => {
    updateSubTask(
      { taskId, subTaskId, completed: checked },
      {
        onSuccess: () => {
          toast.success("Sub task updated successfully");
        },
        onError: (error: any) => {
          const errMessage = error.response.data.message;
          console.log(error);
          toast.error(errMessage);
        },
      }
    );
  };

  const handleAddSubTask = () => {
    addSubTask(
      { taskId, title: newSubTask },
      {
        onSuccess: () => {
          setNewSubTask("");
          toast.success("Sub task added successfully");
        },
        onError: (error: any) => {
          const errMessage = error.response.data.message;
          console.log(error);
          toast.error(errMessage);
        },
      }
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-slate-200 mb-0">
        Maintenance Sub-Tasks
      </h3>

      <div className="space-y-2 mb-4">
        {subTasks.length > 0 ? (
          subTasks.map((subTask) => (
            <div key={subTask._id} className="flex items-center space-x-2">
              <Checkbox
                id={subTask._id}
                checked={subTask.completed}
                onCheckedChange={(checked) =>
                  handleToggleTask(subTask._id, !!checked)
                }
                disabled={isUpdating}
                className="data-[state=checked]:bg-blue-600 border-slate-500"
              />

              <label
                className={cn(
                  "text-sm text-white cursor-pointer",
                  subTask.completed ? "line-through text-slate-400" : ""
                )}
                htmlFor={subTask._id}
              >
                {subTask.title}
              </label>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-400">No maintenance sub-tasks</div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add maintenance checklist item..."
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
          className="flex-1 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50"
          disabled={isPending}
        />

        <Button
          onClick={handleAddSubTask}
          disabled={isPending || newSubTask.length === 0}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
        >
          {isPending ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  );
};
