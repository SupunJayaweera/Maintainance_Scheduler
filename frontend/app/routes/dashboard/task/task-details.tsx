import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { CommentSection } from "@/components/task/comment-section";
import { SubTasksDetails } from "@/components/task/sub-tasks";
import { TaskActivity } from "@/components/task/task-activity";
import { TaskAssigneesSelector } from "@/components/task/task-assignees-selector";
import { TaskDescription } from "@/components/task/task-description";
import { TaskPrioritySelector } from "@/components/task/task-priority-selector";
import { TaskStatusSelector } from "@/components/task/task-status-selector";
import { TaskTitle } from "@/components/task/task-title";
import { Watchers } from "@/components/task/watches";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndustrialPageLayout } from "@/components/layout/industrial-page-layout";
import {
  useAchievedTaskMutation,
  useTaskByIdQuery,
  useWatchTaskMutation,
} from "@/hooks/use-task";
import { useAuth } from "@/provider/auth-context";
import type { Project, Task } from "@/types";
import { format, formatDistanceToNow } from "date-fns";
import { Eye, EyeOff, Wrench } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const TaskDetails = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams<{
    taskId: string;
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();

  const { data, isLoading } = useTaskByIdQuery(taskId!) as {
    data: {
      task: Task;
      project: Project;
    };
    isLoading: boolean;
  };
  const { mutate: watchTask, isPending: isWatching } = useWatchTaskMutation();
  const { mutate: achievedTask, isPending: isAchieved } =
    useAchievedTaskMutation();

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold">Task not found</div>
      </div>
    );
  }

  const { task, project } = data;
  const isUserWatching = task?.watchers?.some(
    (watcher) => watcher._id.toString() === user?._id.toString()
  );

  const goBack = () => navigate(-1);

  const members = task?.assignees || [];

  const handleWatchTask = () => {
    watchTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task watched");
        },
        onError: () => {
          toast.error("Failed to watch task");
        },
      }
    );
  };

  const handleAchievedTask = () => {
    achievedTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task achieved");
        },
        onError: () => {
          toast.error("Failed to achieve task");
        },
      }
    );
  };

  return (
    <IndustrialPageLayout
      title={`Task: ${task.title}`}
      subtitle="Maintenance task tracking and progress management"
      icon={Wrench}
      headerBadge={{
        label: task.status,
        color:
          task.status === "Done"
            ? "bg-green-500/20 text-green-300 border-green-500/30"
            : task.status === "In Progress"
              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
              : "bg-slate-500/20 text-slate-300 border-slate-500/30",
        icon: Wrench,
      }}
    >
      <div className="container mx-auto p-0 py-4 md:px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <BackButton />

            <h1 className="text-xl md:text-2xl font-bold text-white">
              {task.title}
            </h1>

            {task.isArchived && (
              <Badge
                className="ml-2 border-amber-600/50 text-amber-300"
                variant={"outline"}
              >
                Archived
              </Badge>
            )}
          </div>

          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button
              variant={"outline"}
              size="sm"
              onClick={handleWatchTask}
              className="w-fit bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
              disabled={isWatching}
            >
              {isUserWatching ? (
                <>
                  <EyeOff className="mr-2 size-4" />
                  Unwatch
                </>
              ) : (
                <>
                  <Eye className="mr-2 size-4" />
                  Watch
                </>
              )}
            </Button>

            <Button
              variant={"outline"}
              size="sm"
              onClick={handleAchievedTask}
              className="w-fit bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
              disabled={isAchieved}
            >
              {task.isArchived ? "Unarchive" : "Archive"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div>
                  <Badge
                    className={
                      task.priority === "High"
                        ? "bg-red-600/80 hover:bg-red-600 text-white border-red-500/50"
                        : task.priority === "Medium"
                          ? "bg-amber-600/80 hover:bg-amber-600 text-white border-amber-500/50"
                          : "bg-slate-600/80 hover:bg-slate-600 text-white border-slate-500/50"
                    }
                  >
                    {task.priority === "High"
                      ? "Critical"
                      : task.priority === "Medium"
                        ? "Standard"
                        : "Routine"}{" "}
                    Priority
                  </Badge>

                  <TaskTitle title={task.title} taskId={task._id} />

                  <div className="text-sm md:text-base text-slate-300">
                    Created at:{" "}
                    {formatDistanceToNow(new Date(task.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <TaskStatusSelector status={task.status} taskId={task._id} />

                  <Button
                    variant={"destructive"}
                    size="sm"
                    onClick={() => {}}
                    className="hidden md:block bg-red-600/80 hover:bg-red-600 text-white border-red-500/50"
                  >
                    Delete Task
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-200 mb-0">
                  Task Description
                </h3>

                <TaskDescription
                  description={task.description || ""}
                  taskId={task._id}
                />
              </div>

              <TaskAssigneesSelector
                task={task}
                assignees={task.assignees}
                projectMembers={project.members as any}
              />

              <TaskPrioritySelector
                priority={task.priority}
                taskId={task._id}
              />

              <SubTasksDetails
                subTasks={task.subtasks || []}
                taskId={task._id}
              />
            </div>

            <CommentSection
              taskId={task._id}
              members={project.members as any}
            />
          </div>

          {/* right side */}
          <div className="w-full">
            <Watchers watchers={task.watchers || []} />

            <TaskActivity resourceId={task._id} />
          </div>
        </div>
      </div>
    </IndustrialPageLayout>
  );
};

export default TaskDetails;
