import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskTitleMutation } from "@/hooks/use-task";
import { toast } from "sonner";

export const TaskTitle = ({
  title,
  taskId,
}: {
  title: string;
  taskId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { mutate, isPending } = useUpdateTaskTitleMutation();
  const updateTitle = () => {
    mutate(
      { taskId, title: newTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Title updated successfully");
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
    <div className="flex items-center gap-2">
      {isEditing ? (
        <Input
          className="text-xl! font-semibold w-full min-w-3xl bg-slate-700/50 border-slate-600/50 text-white focus:border-blue-500/50"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <h2 className="text-xl flex-1 font-semibold text-white">{title}</h2>
      )}

      {isEditing ? (
        <Button
          className="py-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
          size="sm"
          onClick={updateTitle}
          disabled={isPending}
        >
          Save
        </Button>
      ) : (
        <Edit
          className="size-3 cursor-pointer text-slate-300 hover:text-white"
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  );
};
