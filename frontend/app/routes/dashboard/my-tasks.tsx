import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IndustrialPageLayout,
  IndustrialCard,
  IndustrialLoading,
  IndustrialEmptyState,
} from "@/components/layout/industrial-page-layout";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import type { Task } from "@/types";
import { format } from "date-fns";
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  FilterIcon,
  ListCheck,
  Activity,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilter = searchParams.get("filter") || "all";
  const initialSort = searchParams.get("sort") || "desc";
  const initialSearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState<string>(initialFilter);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSort === "asc" ? "asc" : "desc"
  );
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    params.filter = filter;
    params.sort = sortDirection;
    params.search = search;

    setSearchParams(params, { replace: true });
  }, [filter, sortDirection, search]);

  useEffect(() => {
    const urlFilter = searchParams.get("filter") || "all";
    const urlSort = searchParams.get("sort") || "desc";
    const urlSearch = searchParams.get("search") || "";

    if (urlFilter !== filter) setFilter(urlFilter);
    if (urlSort !== sortDirection)
      setSortDirection(urlSort === "asc" ? "asc" : "desc");
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const { data: myTasks, isLoading } = useGetMyTasksQuery() as {
    data: Task[];
    isLoading: boolean;
  };

  const filteredTasks =
    myTasks?.length > 0
      ? myTasks
          .filter((task) => task.project !== null) // Filter out tasks with null projects
          .filter((task) => {
            if (filter === "all") return true;
            if (filter === "todo") return task.status === "To Do";
            if (filter === "inprogress") return task.status === "In Progress";
            if (filter === "done") return task.status === "Done";
            if (filter === "achieved") return task.isArchived === true;
            if (filter === "high") return task.priority === "High";

            return true;
          })
          .filter(
            (task) =>
              task.title.toLowerCase().includes(search.toLowerCase()) ||
              task.description?.toLowerCase().includes(search.toLowerCase())
          )
      : [];

  //   sort task
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return sortDirection === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    return 0;
  });

  const todoTasks = sortedTasks.filter((task) => task.status === "To Do");
  const inProgressTasks = sortedTasks.filter(
    (task) => task.status === "In Progress"
  );
  const doneTasks = sortedTasks.filter((task) => task.status === "Done");

  if (isLoading) {
    return (
      <IndustrialLoading
        icon={ListCheck}
        message="Loading maintenance tasks..."
      />
    );
  }

  return (
    <IndustrialPageLayout
      title="My Maintenance Tasks"
      subtitle="Industrial task management dashboard"
      icon={ListCheck}
      headerBadge={{
        label: `${sortedTasks.length} Active Tasks`,
        color: "bg-green-500/20 text-green-300 border-green-500/30",
        icon: Activity,
      }}
    >
      {/* Controls */}
      <IndustrialCard>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search maintenance tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              className="border-slate-600 text-black hover:bg-slate-700 hover:text-white"
            >
              {sortDirection === "asc" ? "Oldest First" : "Newest First"}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-slate-600 text-black hover:bg-slate-700 hover:text-white"
                >
                  <FilterIcon className="w-4 h-4 mr-1" /> Filter
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("todo")}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("inprogress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("done")}>
                  Done
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("achieved")}>
                  Achieved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("high")}>
                  High
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </IndustrialCard>

      {/* Task Views */}
      <IndustrialCard title="Task Management" icon={Wrench}>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="bg-slate-700/50 border-slate-600/50">
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-slate-600 data-[state=active]:text-white data-[state=inactive]:text-gray-300 "
            >
              List View
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className="data-[state=active]:bg-slate-600 data-[state=active]:text-white data-[state=inactive]:text-gray-300"
            >
              Board View
            </TabsTrigger>
          </TabsList>

          {/* LIST VIEW */}
          <TabsContent value="list">
            <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <ListCheck className="h-5 w-5 text-blue-400" />
                  My Tasks
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {sortedTasks?.length} maintenance tasks assigned to you
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="divide-y divide-slate-700/50">
                  {sortedTasks?.map((task) => (
                    <div
                      key={task._id}
                      className="p-4 hover:bg-slate-700/30 transition-colors duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-3">
                        <div className="flex">
                          <div className="flex gap-2 mr-2">
                            {task.status === "Done" ? (
                              <CheckCircle className="size-4 text-green-500" />
                            ) : (
                              <Clock className="size-4 text-yellow-500" />
                            )}
                          </div>

                          <div>
                            <Link
                              to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                              className="font-medium text-white hover:text-blue-400 hover:underline transition-colors flex items-center"
                            >
                              {task.title}
                              <ArrowUpRight className="size-4 ml-1" />
                            </Link>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant={
                                  task.status === "Done" ? "default" : "outline"
                                }
                                className={
                                  task.status === "Done"
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : task.status === "In Progress"
                                      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                      : "bg-slate-600/50 text-slate-300 border-slate-500/50"
                                }
                              >
                                {task.status}
                              </Badge>

                              {task.priority && (
                                <Badge
                                  variant={
                                    task.priority === "High"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className={
                                    task.priority === "High"
                                      ? "bg-red-500/20 text-red-300 border-red-500/30"
                                      : "bg-slate-600/50 text-slate-300 border-slate-500/50"
                                  }
                                >
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {task.priority}
                                </Badge>
                              )}

                              {task.isArchived && (
                                <Badge
                                  variant="outline"
                                  className="bg-orange-500/20 text-orange-300 border-orange-500/30"
                                >
                                  Archived
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-slate-400 space-y-1">
                          {task.dueDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Due: {format(task.dueDate, "MMM d, yyyy")}
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <Wrench className="h-3 w-3" />
                            Project:{" "}
                            <span className="font-medium text-slate-300">
                              {task.project.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            Modified: {format(task.updatedAt, "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {sortedTasks?.length === 0 && (
                    <div className="p-8 text-center">
                      <Wrench className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">
                        No maintenance tasks found
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BOARD VIEW */}
          <TabsContent value="board">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-slate-200">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      To Do
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                    >
                      {todoTasks?.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                  {todoTasks?.map((task) => (
                    <Card
                      key={task._id}
                      className="bg-slate-700/30 backdrop-blur-md border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                    >
                      {task.project ? (
                        <Link
                          to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                          className="block p-3"
                        >
                          <h3 className="font-medium text-white mb-2">
                            {task.title}
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-3 mb-3">
                            {task.description || "No description available"}
                          </p>

                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={
                                task.priority === "High"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                task.priority === "High"
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-slate-600/50 text-slate-300 border-slate-500/50"
                              }
                            >
                              {task.priority === "High" && (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              )}
                              {task.priority}
                            </Badge>

                            {task.dueDate && (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(task.dueDate, "MMM d")}
                              </span>
                            )}
                          </div>
                        </Link>
                      ) : (
                        <div className="block p-3">
                          <h3 className="font-medium text-white mb-2">
                            {task.title}
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-3 mb-3">
                            {task.description || "No description available"}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={
                                task.priority === "High"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                task.priority === "High"
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-slate-600/50 text-slate-300 border-slate-500/50"
                              }
                            >
                              {task.priority}
                            </Badge>
                            {task.dueDate && (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(task.dueDate, "MMM d")}
                              </span>
                            )}
                            <Badge
                              variant="destructive"
                              className="ml-auto bg-red-500/20 text-red-300 border-red-500/30"
                            >
                              Project Missing
                            </Badge>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}

                  {todoTasks?.length === 0 && (
                    <div className="p-4 text-center">
                      <Clock className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">No tasks to do</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-slate-200">
                    <span className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-yellow-400" />
                      In Progress
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                    >
                      {inProgressTasks?.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                  {inProgressTasks?.map((task) => (
                    <Card
                      key={task._id}
                      className="bg-slate-700/30 backdrop-blur-md border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10"
                    >
                      <Link
                        to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                        className="block p-3"
                      >
                        <h3 className="font-medium text-white mb-2">
                          {task.title}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-3 mb-3">
                          {task.description || "No description available"}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant={
                              task.priority === "High"
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              task.priority === "High"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-slate-600/50 text-slate-300 border-slate-500/50"
                            }
                          >
                            {task.priority === "High" && (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            {task.priority}
                          </Badge>

                          {task.dueDate && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(task.dueDate, "MMM d")}
                            </span>
                          )}
                        </div>
                      </Link>
                    </Card>
                  ))}

                  {inProgressTasks?.length === 0 && (
                    <div className="p-4 text-center">
                      <Activity className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        No tasks in progress
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-slate-200">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Done
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-green-500/20 text-green-300 border-green-500/30"
                    >
                      {doneTasks?.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                  {doneTasks?.map((task) => (
                    <Card
                      key={task._id}
                      className="bg-slate-700/30 backdrop-blur-md border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10 opacity-75"
                    >
                      <Link
                        to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                        className="block p-3"
                      >
                        <h3 className="font-medium text-white mb-2 line-through decoration-green-400">
                          {task.title}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-3 mb-3">
                          {task.description || "No description available"}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className="bg-green-500/20 text-green-300 border-green-500/30"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>

                          {task.dueDate && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(task.dueDate, "MMM d")}
                            </span>
                          )}
                        </div>
                      </Link>
                    </Card>
                  ))}

                  {doneTasks?.length === 0 && (
                    <div className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">
                        No completed tasks
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </IndustrialCard>
    </IndustrialPageLayout>
  );
};

export default MyTasks;
