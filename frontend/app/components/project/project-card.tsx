import type { Project } from "@/types";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { getTaskStatusColor } from "@/lib";
import { Progress } from "../ui/progress";
import { format } from "date-fns";
import { Archive, CalendarDays } from "lucide-react";

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
    <Link
      to={`/workspaces/${workspaceId}/projects/${project._id}`}
      className="group"
    >
      <Card className="bg-slate-700/30 backdrop-blur-md border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group-hover:bg-slate-700/50">
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            <CardTitle className="flex items-center gap-2 text-white group-hover:text-blue-300 transition-colors">
              {project.title}
              {project.isArchived && (
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-500/20 text-orange-300 border-orange-500/30"
                >
                  <Archive className="h-3 w-3 mr-1" />
                  Archived
                </Badge>
              )}
            </CardTitle>
            <Badge
              variant="outline"
              className="text-xs font-medium bg-slate-600/50 text-slate-300 border-slate-500/50"
            >
              {project.status}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 text-slate-300">
            {project.description ||
              "No description provided for this maintenance project."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Project Progress</span>
                <span className="text-slate-300 font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-slate-700" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <CalendarDays className="w-4 h-4" />
                <span className="text-slate-300 font-medium">
                  {project.tasks.length}
                </span>
                <span>Maintenance Tasks</span>
              </div>

              {project.dueDate && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <span>Due:</span>
                  <span className="text-slate-300">
                    {format(project.dueDate, "MMM dd")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
