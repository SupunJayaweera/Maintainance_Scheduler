import type { Project } from "@/types";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";
import { getTaskStatusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: string;
}

export const ProjectCard = ({
  project,
  progress,
  workspaceId,
}: ProjectCardProps) => {
  return (
    <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
      <Card className="transition-all hover:translate-y-1 duration-300 hover:shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.title}</CardTitle>
            <span
              className={cn(
                "text-xs rounded-full",
                getTaskStatusColor(project.status)
              )}
            >
              {project.status}
            </span>
            <CardDescription className="line-clamp-2">
              {project.description || "No description provided."}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <span>{project.tasks.length}</span>
              <span>Tasks</span>
            </div>
            {project.dueDate && (
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4" />
                <span>{format(project.dueDate, "MMMM dd, yyyy")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
