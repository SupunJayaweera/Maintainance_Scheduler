import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useGetWorkspaceDetailsQuery } from "@/hooks/use-workspace";
import type { Task, Workspace } from "@/types";
import { format } from "date-fns";
import { Users, Shield, Activity, UserPlus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const workspaceId = searchParams.get("workspaceId");
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    params.search = search;

    setSearchParams(params, { replace: true });
  }, [search]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId!) as {
    data: Workspace;
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <IndustrialLoading icon={Users} message="Loading workspace members..." />
    );
  }

  if (!data || !workspaceId) {
    return (
      <IndustrialPageLayout
        title="Members"
        subtitle="Team management"
        icon={Users}
      >
        <IndustrialEmptyState
          icon={Users}
          title="No Workspace Found"
          description="Please select a workspace to view members."
        />
      </IndustrialPageLayout>
    );
  }

  const filteredMembers = data?.members?.filter(
    (member) =>
      member.user.name.toLowerCase().includes(search.toLowerCase()) ||
      member.user.email.toLowerCase().includes(search.toLowerCase()) ||
      member.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <IndustrialPageLayout
      title="Industrial Team Members"
      subtitle={`Managing ${data?.name || "workspace"} personnel`}
      icon={Users}
      headerBadge={{
        label: `${filteredMembers?.length || 0} Members`,
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        icon: Activity,
      }}
      // headerActions={
      //   <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
      //     <UserPlus className="w-4 h-4 mr-2" />
      //     Invite Member
      //   </Button>
      // }
    >
      {/* Search Controls */}
      <IndustrialCard>
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500/50"
            />
          </div>
        </div>
      </IndustrialCard>

      {/* Members Content */}
      <IndustrialCard title="Team Overview" icon={Users}>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="bg-slate-700/50 border-slate-600/50">
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-slate-600 data-[state=active]:text-white data-[state=inactive]:text-gray-300"
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
                <CardTitle className="text-slate-200">Members</CardTitle>
                <CardDescription className="text-slate-400">
                  {filteredMembers?.length === 1
                    ? "1 member in your workspace"
                    : `${filteredMembers?.length} members in your workspace`}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="divide-y divide-slate-700/50">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.user._id}
                      className="flex flex-col md:flex-row items-center justify-between p-4 gap-3 hover:bg-slate-700/30 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="bg-slate-600 ring-2 ring-slate-500/50">
                          <AvatarImage src={member.user.profilePicture} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                            {member.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">
                            {member.user.name}
                          </p>
                          <p className="text-sm text-slate-400">
                            {member.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-11 md:ml-0">
                        <Badge
                          variant={
                            ["admin", "owner"].includes(member.role)
                              ? "destructive"
                              : "secondary"
                          }
                          className={`capitalize ${
                            ["admin", "owner"].includes(member.role)
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : "bg-slate-600/50 text-slate-300 border-slate-500/50"
                          }`}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {member.role}
                        </Badge>

                        <Badge
                          variant="outline"
                          className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                        >
                          {data.name}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BOARD VIEW */}
          <TabsContent value="board">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <Card
                  key={member.user._id}
                  className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="bg-slate-600 size-20 mb-4 ring-2 ring-slate-500/50">
                      <AvatarImage src={member.user.profilePicture} />
                      <AvatarFallback className="uppercase bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold text-lg">
                        {member.user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-lg font-medium mb-2 text-white">
                      {member.user.name}
                    </h3>

                    <p className="text-sm text-slate-400 mb-4 truncate w-full">
                      {member.user.email}
                    </p>

                    <Badge
                      variant={
                        ["admin", "owner"].includes(member.role)
                          ? "destructive"
                          : "secondary"
                      }
                      className={`capitalize ${
                        ["admin", "owner"].includes(member.role)
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : "bg-slate-600/50 text-slate-300 border-slate-500/50"
                      }`}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {member.role}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </IndustrialCard>
    </IndustrialPageLayout>
  );
};

export default Members;
