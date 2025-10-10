import { useUpdateTaskDescriptionMutation } from "@/hooks/use-task";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const TaskDescription = ({
  description,
  taskId,
}: {
  description: string;
  taskId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const { mutate, isPending } = useUpdateTaskDescriptionMutation();
  const updateDescription = () => {
    mutate(
      { taskId, description: newDescription },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Description updated successfully");
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
        <Textarea
          className="w-full min-w-3xl bg-slate-700/50 border-slate-600/50 text-white focus:border-blue-500/50"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={isPending}
        />
      ) : (
        <div className="text-sm md:text-base text-pretty flex-1 text-slate-300">
          {description}
        </div>
      )}

      {isEditing ? (
        <Button
          className="py-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
          size="sm"
          onClick={updateDescription}
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
