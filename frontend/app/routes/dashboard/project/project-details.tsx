import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndustrialPageLayout } from "@/components/layout/industrial-page-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UseProjectQuery,
  useArchiveProjectMutation,
  useUpdateProjectStatusMutation,
} from "@/hooks/use-projects";

import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import { getTaskStatusColor } from "@/lib";
import type { Project, Task, TaskStatus, ProjectStatus } from "@/types";
import { format } from "date-fns";
import {
  AlertCircle,
  Archive,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/provider/auth-context";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const archiveProjectMutation = useArchiveProjectMutation();
  const updateStatusMutation = useUpdateProjectStatusMutation();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");

  const { data, isLoading } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  const handleArchiveProject = async () => {
    if (!projectId) return;

    try {
      await archiveProjectMutation.mutateAsync(projectId);

      // Invalidate and refetch project data
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["projects", "archived"] });

      toast.success(
        project.isArchived
          ? "Project unarchived successfully"
          : "Project archived successfully"
      );

      // Navigate back to workspace
      navigate(`/workspaces/${workspaceId}`);
    } catch (error) {
      console.error("Archive error:", error);
      toast.error("Failed to archive/unarchive project");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!projectId) return;

    try {
      await updateStatusMutation.mutateAsync({
        projectId,
        status: newStatus,
      });

      // Invalidate and refetch project data
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });

      toast.success("Project status updated successfully");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update project status");
    }
  };

  // Check if current user can archive the project
  const currentUserMember = project.members?.find((member) => {
    const memberId =
      typeof member.user === "string" ? member.user : member.user._id;
    return memberId === user?._id;
  });

  // Check workspace permissions
  const workspaceMember = project.workspace?.members?.find((member) => {
    const memberId =
      typeof member.user === "string" ? member.user : member.user._id;
    return memberId === user?._id;
  });

  const canArchive =
    currentUserMember?.role === "manager" ||
    workspaceMember?.role === "owner" ||
    workspaceMember?.role === "admin";

  // Check if current user can update project status (same permissions as archive)
  const canUpdateStatus = canArchive;

  console.log(project.isArchived, canArchive);

  console.log(
    currentUserMember?.role,
    workspaceMember?.role,
    workspaceMember?.role
  );
  return (
    <IndustrialPageLayout
      title={`Project: ${project.title}`}
      subtitle="Maintenance project management and task coordination"
      icon={Calendar}
      headerBadge={{
        label: `${tasks.length} Tasks`,
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        icon: Clock,
      }}
    >
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <BackButton />
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {project.title}
              </h1>
              {project.isArchived && (
                <Badge variant="outline" className="text-xs">
                  <Archive className="h-3 w-3 mr-1" />
                  Archived
                </Badge>
              )}
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  getTaskStatusColor(project.status as ProjectStatus)
                )}
              >
                {project.status}
              </Badge>
            </div>
            {project.description && (
              <p className="text-sm text-slate-300">{project.description}</p>
            )}
            {canUpdateStatus && !project.isArchived && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-slate-300">Status:</span>
                <Select
                  value={project.status}
                  onValueChange={handleStatusChange}
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 min-w-32">
              <div className="text-sm text-slate-300">Progress:</div>
              <div className="flex-1">
                <Progress value={projectProgress} className="h-2" />
              </div>
              <span className="text-sm text-slate-300">{projectProgress}%</span>
            </div>

            <div className="flex gap-2">
              {canArchive && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleArchiveProject}
                  title={
                    project.isArchived ? "Unarchive Project" : "Archive Project"
                  }
                >
                  <Archive className="size-4 mr-2" />
                  {project.isArchived ? "Unarchive" : "Archive"}
                </Button>
              )}
              <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList className="bg-slate-700/50 border-slate-600/50">
                <TabsTrigger
                  value="all"
                  onClick={() => setTaskFilter("All")}
                  className="text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                >
                  All Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="todo"
                  onClick={() => setTaskFilter("To Do")}
                  className="text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                >
                  Scheduled
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  onClick={() => setTaskFilter("In Progress")}
                  className="text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                >
                  In Progress
                </TabsTrigger>
                <TabsTrigger
                  value="done"
                  onClick={() => setTaskFilter("Done")}
                  className="text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white"
                >
                  Completed
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center text-sm">
                <span className="text-slate-300">Status:</span>
                <div>
                  <Badge variant="outline" className="bg-background">
                    {tasks.filter((task) => task.status === "To Do").length} To
                    Do
                  </Badge>
                  <Badge variant="outline" className="bg-background">
                    {
                      tasks.filter((task) => task.status === "In Progress")
                        .length
                    }{" "}
                    In Progress
                  </Badge>
                  <Badge variant="outline" className="bg-background">
                    {tasks.filter((task) => task.status === "Done").length} Done
                  </Badge>
                </div>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="grid grid-cols-3 gap-4">
                <TaskColumn
                  title="To Do"
                  tasks={tasks.filter((task) => task.status === "To Do")}
                  onTaskClick={handleTaskClick}
                />

                <TaskColumn
                  title="In Progress"
                  tasks={tasks.filter((task) => task.status === "In Progress")}
                  onTaskClick={handleTaskClick}
                />

                <TaskColumn
                  title="Done"
                  tasks={tasks.filter((task) => task.status === "Done")}
                  onTaskClick={handleTaskClick}
                />
              </div>
            </TabsContent>

            <TabsContent value="todo" className="m-0">
              <div className="grid md:grid-cols-1 gap-4">
                <TaskColumn
                  title="To Do"
                  tasks={tasks.filter((task) => task.status === "To Do")}
                  onTaskClick={handleTaskClick}
                  isFullWidth
                />
              </div>
            </TabsContent>

            <TabsContent value="in-progress" className="m-0">
              <div className="grid md:grid-cols-1 gap-4">
                <TaskColumn
                  title="In Progress"
                  tasks={tasks.filter((task) => task.status === "In Progress")}
                  onTaskClick={handleTaskClick}
                  isFullWidth
                />
              </div>
            </TabsContent>

            <TabsContent value="done" className="m-0">
              <div className="grid md:grid-cols-1 gap-4">
                <TaskColumn
                  title="Done"
                  tasks={tasks.filter((task) => task.status === "Done")}
                  onTaskClick={handleTaskClick}
                  isFullWidth
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* create    task dialog */}
        <CreateTaskDialog
          open={isCreateTask}
          onOpenChange={setIsCreateTask}
          projectId={projectId!}
          projectMembers={project.members as any}
        />
      </div>
    </IndustrialPageLayout>
  );
};

export default ProjectDetails;

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
}: TaskColumnProps) => {
  return (
    <div
      className={
        isFullWidth
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : ""
      }
    >
      <div
        className={cn(
          "space-y-4",
          !isFullWidth ? "h-full" : "col-span-full mb-4"
        )}
      >
        {!isFullWidth && (
          <div className="flex items-center justify-between">
            <h1 className="font-medium text-white">{title}</h1>
            <Badge
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              {tasks.length}
            </Badge>
          </div>
        )}

        <div
          className={cn(
            "space-y-3",
            isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4"
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-center text-sm text-slate-400">
              No tasks yet
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
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
                : "Routine"}
          </Badge>

          <div className="flex gap-1">
            {task.status !== "To Do" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-6 hover:bg-slate-600/50 text-slate-300 hover:text-white"
                onClick={() => {
                  console.log("mark as to do");
                }}
                title="Mark as To Do"
              >
                <AlertCircle className={cn("size-4")} />
                <span className="sr-only">Mark as To Do</span>
              </Button>
            )}
            {task.status !== "In Progress" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-6 hover:bg-slate-600/50 text-slate-300 hover:text-white"
                onClick={() => {
                  console.log("mark as in progress");
                }}
                title="Mark as In Progress"
              >
                <Clock className={cn("size-4")} />
                <span className="sr-only">Mark as In Progress</span>
              </Button>
            )}
            {task.status !== "Done" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-6 hover:bg-slate-600/50 text-slate-300 hover:text-white"
                onClick={() => {
                  console.log("mark as done");
                }}
                title="Mark as Done"
              >
                <CheckCircle className={cn("size-4")} />
                <span className="sr-only">Mark as Done</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h4 className="font-medium mb-2 text-white">{task.title}</h4>

        {task.description && (
          <p className="text-sm text-slate-300 line-clamp-2 mb-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 5).map((member) => (
                  <Avatar
                    key={member._id}
                    className="relative size-8 bg-slate-600 rounded-full border-2 border-slate-800 overflow-hidden"
                    title={member.name}
                  >
                    <AvatarImage src={member.profilePicture} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}

                {task.assignees.length > 5 && (
                  <span className="text-xs text-slate-400">
                    + {task.assignees.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          {task.dueDate && (
            <div className="text-xs text-slate-400 flex items-center">
              <Calendar className="size-3 mr-1" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </div>
          )}
        </div>
        {/* 5/10 subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-2 text-xs text-slate-400">
            {task.subtasks.filter((subtask) => subtask.completed).length} /{" "}
            {task.subtasks.length} subtasks
          </div>
        )}
      </CardContent>
    </Card>
  );
};
