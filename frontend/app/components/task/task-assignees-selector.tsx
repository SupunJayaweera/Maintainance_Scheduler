import type { ProjectMemberRole, Task, User } from "@/types";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { useUpdateTaskAssigneesMutation } from "@/hooks/use-task";
import { toast } from "sonner";

export const TaskAssigneesSelector = ({
  task,
  assignees,
  projectMembers,
}: {
  task: Task;
  assignees: User[];
  projectMembers: { user: User; role: ProjectMemberRole }[];
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    assignees.map((assignee) => assignee._id)
  );
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { mutate, isPending } = useUpdateTaskAssigneesMutation();

  const handleSelectAll = () => {
    const allIds = projectMembers.map((m) => m.user._id);

    setSelectedIds(allIds);
  };

  const handleUnSelectAll = () => {
    setSelectedIds([]);
  };

  const handleSelect = (id: string) => {
    let newSelected: string[] = [];

    if (selectedIds.includes(id)) {
      newSelected = selectedIds.filter((sid) => sid !== id);
    } else {
      newSelected = [...selectedIds, id];
    }

    setSelectedIds(newSelected);
  };

  const handleSave = () => {
    mutate(
      {
        taskId: task._id,
        assignees: selectedIds,
      },
      {
        onSuccess: () => {
          setDropDownOpen(false);
          toast.success("Assignees updated successfully");
        },
        onError: (error: any) => {
          const errMessage =
            error.response?.data?.message || "Failed to update assignees";
          toast.error(errMessage);
          console.log(error);
        },
      }
    );
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-slate-200 mb-2">
        Assigned Technicians
      </h3>

      <div className="flex flex-wrap gap-2 mb-2">
        {selectedIds.length === 0 ? (
          <span className="text-xs text-slate-400">
            No technicians assigned
          </span>
        ) : (
          projectMembers
            .filter((member) => selectedIds.includes(member.user._id))
            .map((m) => (
              <div
                key={m.user._id}
                className="flex items-center bg-slate-700/50 border border-slate-600/50 rounded px-2 py-1"
              >
                <Avatar className="size-6 mr-1 bg-slate-600 border border-slate-500">
                  <AvatarImage src={m.user.profilePicture} />
                  <AvatarFallback className="text-white text-xs">
                    {m.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-white">{m.user.name}</span>
              </div>
            ))
        )}
      </div>

      {/* dropdown */}
      <div className="relative">
        <button
          className="text-sm text-white w-full border border-slate-600/50 rounded px-3 py-2 text-left bg-slate-700/50 hover:bg-slate-600/50"
          onClick={() => setDropDownOpen(!dropDownOpen)}
        >
          {selectedIds.length === 0
            ? "Select maintenance team"
            : `${selectedIds.length} technicians selected`}
        </button>

        {dropDownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded shadow-lg max-h-60 overflow-y-auto">
            <div className="flex justify-between px-2 py-1 border-b border-slate-700">
              <button
                className="text-xs text-blue-400 hover:text-blue-300"
                onClick={handleSelectAll}
              >
                Select all
              </button>
              <button
                className="text-xs text-red-400 hover:text-red-300"
                onClick={handleUnSelectAll}
              >
                Unselect all
              </button>
            </div>

            {projectMembers.map((m) => (
              <label
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-slate-700/50 text-white"
                key={m.user._id}
              >
                <Checkbox
                  checked={selectedIds.includes(m.user._id)}
                  onCheckedChange={() => handleSelect(m.user._id)}
                  className="mr-2 data-[state=checked]:bg-blue-600 border-slate-500"
                />

                <Avatar className="size-6 mr-2 bg-slate-600 border border-slate-500">
                  <AvatarImage src={m.user.profilePicture} />
                  <AvatarFallback className="text-white text-xs">
                    {m.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <span>{m.user.name}</span>
              </label>
            ))}

            <div className="flex justify-between px-2 py-1 bg-slate-900/50 border-t border-slate-700">
              <Button
                variant={"outline"}
                size={"sm"}
                className="font-light bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                onClickCapture={() => setDropDownOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                size={"sm"}
                className="font-light bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                disabled={isPending}
                onClickCapture={() => handleSave()}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
