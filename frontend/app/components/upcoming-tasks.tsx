import type { Task } from "@/types";
import { Link, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

export const UpcomingTasks = ({ data }: { data: Task[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-200">Upcoming Tasks</CardTitle>
        <CardDescription className="text-slate-400">
          Here are the tasks that are due soon
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-slate-400 py-8">
            No upcoming tasks yet
          </p>
        ) : (
          data.map((task) => (
            <Link
              to={`/workspaces/${workspaceId}/projects/${task.project}/tasks/${task._id}`}
              key={task._id}
              className="flex items-start space-x-3 border-b border-slate-600/50 pb-3 last:border-0 hover:bg-slate-700/30 -mx-6 px-6 py-3 first:mt-0 transition-colors"
            >
              <div
                className={cn(
                  "mt-0.5 rounded-full p-1",
                  task.priority === "High" && "bg-red-100 text-red-700",
                  task.priority === "Medium" && "bg-yellow-100 text-yellow-700",
                  task.priority === "Low" && "bg-gray-100 text-gray-700"
                )}
              >
                {task.status === "Done" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>

              <div className="space-y-1">
                <p className="font-medium text-sm md:text-base text-slate-200">
                  {task.title}
                </p>
                <div className="flex items-center text-xs text-slate-400">
                  <span>{task.status}</span>
                  {task.dueDate && (
                    <>
                      <span className="mx-1"> - </span>
                      <span>
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
};
