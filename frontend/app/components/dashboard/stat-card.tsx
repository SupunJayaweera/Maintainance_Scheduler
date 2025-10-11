import type { StatsCardProps } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const StatsCard = ({ data }: { data: StatsCardProps }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">
            Total Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {data.totalProjects}
          </div>
          <p className="text-xs text-slate-400">
            {data.totalProjectInProgress} in progress
          </p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">
            Total Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{data.totalTasks}</div>
          <p className="text-xs text-slate-400">
            {data.totalTaskCompleted} completed
          </p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">
            To Do
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {data.totalTaskToDo}
          </div>
          <p className="text-xs text-slate-400">Tasks waiting to be done</p>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-200">
            In Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {data.totalTaskInProgress}
          </div>
          <p className="text-xs text-slate-400">Tasks currently in progress</p>
        </CardContent>
      </Card>
    </div>
  );
};
