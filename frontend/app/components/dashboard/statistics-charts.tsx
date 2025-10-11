import type {
  ProjectStatusData,
  StatsCardProps,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartBarBig, ChartLine, ChartPie } from "lucide-react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

interface StatisticsChartsProps {
  stats: StatsCardProps;
  taskTrendsData: TaskTrendsData[];
  projectStatusData: ProjectStatusData[];
  taskPriorityData: TaskPriorityData[];
  workspaceProductivityData: WorkspaceProductivityData[];
}

export const StatisticsCharts = ({
  stats,
  taskTrendsData,
  projectStatusData,
  taskPriorityData,
  workspaceProductivityData,
}: StatisticsChartsProps) => {
  console.log("stats", stats);
  console.log("taskTrendsData", taskTrendsData);
  console.log("projectStatusData", projectStatusData);
  console.log("taskPriorityData", taskPriorityData);
  console.log("workspaceProductivityData", workspaceProductivityData);

  return (
    <div className="space-y-6">
      {/* Information Banner */}
      {/* <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <ChartLine className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-1">
                Chart Data Overview
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                All charts show data from the last 30 days, with task trends
                grouped into weekly periods for better visualization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-600">
                <div>
                  <strong>Week 4 (Oldest):</strong> Days 1-7 of last 30 days
                </div>
                <div>
                  <strong>Week 3:</strong> Days 8-14 of last 30 days
                </div>
                <div>
                  <strong>Week 2:</strong> Days 15-21 of last 30 days
                </div>
                <div>
                  <strong>Week 1 (Latest):</strong> Days 22-30 of last 30 days
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium text-slate-200">
                Task Trends
              </CardTitle>
              <CardDescription className="text-slate-400">
                Weekly task creation over the last 30 days
              </CardDescription>
            </div>
            <ChartLine className="size-5 text-slate-400" />
          </CardHeader>
          <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
            <div className="mb-4 p-3 bg-slate-700/50 rounded-lg text-sm border border-slate-600/50">
              <h4 className="font-medium mb-2 text-slate-200">
                Chart Explanation:
              </h4>
              <ul className="space-y-1 text-slate-400">
                <li>
                  • <strong className="text-slate-300">Week 4 (Oldest):</strong>{" "}
                  Tasks created in days 1-7 of the last 30 days
                </li>
                <li>
                  • <strong className="text-slate-300">Week 3:</strong> Tasks
                  created in days 8-14 of the last 30 days
                </li>
                <li>
                  • <strong className="text-slate-300">Week 2:</strong> Tasks
                  created in days 15-21 of the last 30 days
                </li>
                <li>
                  • <strong className="text-slate-300">Week 1 (Latest):</strong>{" "}
                  Tasks created in days 22-30 of the last 30 days
                </li>
              </ul>
              <p className="mt-2 text-xs text-slate-400">
                Tasks are grouped by their creation date, showing how many tasks
                of each status were created in each week.
              </p>
            </div>
            <div className="min-w-[350px]">
              <ChartContainer
                className="h-[300px]"
                config={{
                  completed: {
                    label: "Completed Tasks",
                    color: "#10b981",
                  },
                  inProgress: {
                    label: "In Progress Tasks",
                    color: "#f59e0b",
                  },
                  toDo: {
                    label: "To Do Tasks",
                    color: "#3b82f6",
                  },
                }}
              >
                <LineChart data={taskTrendsData}>
                  <XAxis
                    dataKey={"name"}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{
                      value: "Number of Tasks",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />

                  <CartesianGrid strokeDasharray={"3 3"} vertical={false} />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-lg p-3">
                            <h4 className="font-medium text-white">{label}</h4>
                            {data.period && (
                              <p className="text-sm text-slate-300 mb-2">
                                Period: {data.period}
                              </p>
                            )}
                            {payload.map((entry, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-sm text-slate-200">
                                  {entry.name}: {entry.value} tasks
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey={"completed"}
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Completed Tasks"
                  />
                  <Line
                    type="monotone"
                    dataKey="inProgress"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="In Progress Tasks"
                  />
                  <Line
                    type="monotone"
                    dataKey="toDo"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="To Do Tasks"
                  />

                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* project status  */}

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium text-slate-200">
                Job Status
              </CardTitle>
              <CardDescription className="text-slate-400">
                Job status breakdown
              </CardDescription>
            </div>
            <ChartPie className="size-5 text-slate-400" />
          </CardHeader>

          <CardContent className="p-6">
            <ChartContainer
              className="mx-auto aspect-square max-h-[250px]"
              config={{
                Completed: {
                  label: "Completed",
                  color: "#10b981",
                },
                "In Progress": {
                  label: "In Progress",
                  color: "#3b82f6",
                },
                Planning: {
                  label: "Planning",
                  color: "#f59e0b",
                },
              }}
            >
              <PieChart width={250} height={250}>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  // label={({ name, percent }) =>
                  //   percent > 0
                  //     ? `${name} (${(percent * 100).toFixed(0)}%)`
                  //     : ""
                  // }
                  labelLine={false}
                  fontSize={12}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const value = Number(data?.value) || 0;
                      const name = data?.name || "";
                      const total = projectStatusData.reduce(
                        (sum, item) => sum + (Number(item.value) || 0),
                        0
                      );
                      const percentage =
                        total > 0 ? ((value / total) * 100).toFixed(0) : "0";

                      return (
                        <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-lg p-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: data?.color }}
                            />
                            <span className="font-medium text-white">
                              {name}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">
                            {value} projects ({percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* task priority  */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium text-slate-200">
                Task Priority
              </CardTitle>
              <CardDescription className="text-slate-400">
                Task priority breakdown
              </CardDescription>
            </div>
            <ChartPie className="size-5 text-slate-400" />
          </CardHeader>

          <CardContent className="p-6">
            <ChartContainer
              className="mx-auto aspect-square max-h-[250px]"
              config={{
                High: {
                  label: "High Priority",
                  color: "#ef4444",
                },
                Medium: {
                  label: "Medium Priority",
                  color: "#f59e0b",
                },
                Low: {
                  label: "Low Priority",
                  color: "#6b7280",
                },
              }}
            >
              <PieChart width={250} height={250}>
                <Pie
                  data={taskPriorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  // label={({ name, percent }) =>
                  //   percent > 0
                  //     ? `${name} (${(percent * 100).toFixed(0)}%)`
                  //     : ""
                  // }
                  labelLine={false}
                  fontSize={12}
                >
                  {taskPriorityData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const value = Number(data?.value) || 0;
                      const name = data?.name || "";
                      const total = taskPriorityData.reduce(
                        (sum, item) => sum + (Number(item.value) || 0),
                        0
                      );
                      const percentage =
                        total > 0 ? ((value / total) * 100).toFixed(0) : "0";

                      return (
                        <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-lg p-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: data?.color }}
                            />
                            <span className="font-medium text-white">
                              {name} Priority
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">
                            {value} tasks ({percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ChartLegend
                  content={<ChartLegendContent />}
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Workspace Productivity Chart */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-0.5">
              <CardTitle className="text-base font-medium text-slate-200">
                Workspace Productivity
              </CardTitle>
              <CardDescription className="text-slate-400">
                Task completion by project
              </CardDescription>
            </div>
            <ChartBarBig className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent className="w-full overflow-x-auto md:overflow-x-hidden">
            <div className="min-w-[350px]">
              <ChartContainer
                className="h-[300px]"
                config={{
                  completed: { color: "#3b82f6" },
                  total: { color: "red" },
                }}
              >
                <BarChart
                  data={workspaceProductivityData}
                  barGap={0}
                  barSize={20}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="total"
                    fill="#000"
                    radius={[4, 4, 0, 0]}
                    name="Total Tasks"
                  />
                  <Bar
                    dataKey="completed"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Completed Tasks"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
