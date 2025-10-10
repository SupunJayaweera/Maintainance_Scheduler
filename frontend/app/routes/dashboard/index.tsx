import { RecentProjects } from "@/components/dashboard/recent-projects";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { Loader } from "@/components/loader";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { Badge } from "@/components/ui/badge";

import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import { useSearchParams } from "react-router";
import { Activity, BarChart3, Clock, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId) as {
    data:
      | {
          stats: StatsCardProps;
          taskTrendsData: TaskTrendsData[];
          projectStatusData: ProjectStatusData[];
          taskPriorityData: TaskPriorityData[];
          workspaceProductivityData: WorkspaceProductivityData[];
          upcomingTasks: Task[];
          recentProjects: Project[];
        }
      | undefined;
    isPending: boolean;
  };

  if (!workspaceId) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8 2xl:space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Industrial Dashboard
                </h1>
                <p className="text-slate-400">
                  Maintenance Management Overview
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700/50 p-8 text-center">
            <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Select a Workspace
            </h3>
            <p className="text-slate-400">
              Choose a workspace from the header to view industrial dashboard
              data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-lg mb-4 mx-auto w-fit">
            <Activity className="h-8 w-8 text-white animate-pulse" />
          </div>
          <Loader />
          <p className="text-slate-400 mt-4">Loading industrial dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8 2xl:space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Dashboard Error
                </h1>
                <p className="text-slate-400">Unable to load data</p>
              </div>
            </div>
          </div>
          <div className="bg-red-500/10 backdrop-blur-md rounded-lg border border-red-500/30 p-8 text-center">
            <div className="text-red-400 text-xl font-semibold mb-2">
              Failed to Load Dashboard
            </div>
            <p className="text-slate-400">
              Please check your connection and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8 2xl:space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Industrial Dashboard
              </h1>
              <p className="text-slate-400">Real-time maintenance analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              Live Data
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              Analytics Active
            </Badge>
          </div>
        </div>

        {/* Stats Cards with Industrial Styling */}
        <div className="bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50 p-6">
          <StatsCard data={data.stats} />
        </div>

        {/* Charts with Industrial Container */}
        <div className="bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">
              Performance Analytics
            </h2>
          </div>
          <StatisticsCharts
            stats={data.stats}
            taskTrendsData={data.taskTrendsData}
            projectStatusData={data.projectStatusData}
            taskPriorityData={data.taskPriorityData}
            workspaceProductivityData={data.workspaceProductivityData}
          />
        </div>

        {/* Recent Data Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">
                Recent Activity
              </h2>
            </div>
            <RecentProjects data={data.recentProjects} />
          </div>
          <div className="bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-green-400" />
              <h2 className="text-lg font-semibold text-white">
                Upcoming Tasks
              </h2>
            </div>
            <UpcomingTasks data={data.upcomingTasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
