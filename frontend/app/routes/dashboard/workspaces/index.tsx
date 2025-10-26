import { Loader } from "@/components/loader";
import { NoDataFound } from "@/components/no-data-found";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types";
import { PlusCircle, Users, Settings, Activity, Building2 } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import { format } from "date-fns";

const Workspace = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-lg mb-4 mx-auto w-fit">
            <Building2 className="h-8 w-8 text-white animate-pulse" />
          </div>
          <Loader />
          <p className="text-slate-400 mt-4">
            Loading industrial workspaces...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Industrial Workspaces
              </h2>
              <p className="text-slate-400">
                Manage your maintenance facilities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 hidden sm:flex">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              {workspaces?.length || 0} Active
            </Badge>
            <Button
              onClick={() => setIsCreatingWorkspace(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Workspace
            </Button>
          </div>
        </div>

        {/* Workspaces Grid */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {workspaces?.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} />
          ))}
          {workspaces?.length === 0 && (
            <div className="col-span-full">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700/50 p-16 text-center">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center border border-blue-500/30">
                    <Building2 className="h-24 w-24 text-blue-400" />
                  </div>
                  <NoDataFound
                    title="No Industrial Workspaces Found"
                    description="Create your first workspace to start managing industrial maintenance operations, track equipment, and coordinate with your team."
                    buttonText="Create Workspace"
                    buttonAction={() => setIsCreatingWorkspace(true)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <CreateWorkspace
          isCreatingWorkspace={isCreatingWorkspace}
          setIsCreatingWorkspace={setIsCreatingWorkspace}
        />
      </div>
    </div>
  );
};

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <Link to={`/workspaces/${workspace._id}`} className="group">
      <Card className="bg-slate-800/50 backdrop-blur-md border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group-hover:bg-slate-800/70">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <WorkspaceAvatar name={workspace.name} color={workspace.color} />
              <div>
                <CardTitle className="text-white group-hover:text-blue-300 transition-colors">
                  {workspace.name}
                </CardTitle>
                <span className="text-sm text-slate-400">
                  Created {format(workspace.createdAt, "MM/dd/yyyy")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-slate-700/50 text-slate-300 text-xs"
              >
                <Users className="h-3 w-3 mr-1" />
                {workspace.members.length}
              </Badge>
            </div>
          </div>

          {workspace.description && (
            <CardDescription className="text-slate-300 line-clamp-2">
              {workspace.description}
            </CardDescription>
          )}

          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-600 text-slate-400 text-xs"
            >
              Industrial
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Industrial maintenance facility
            </div>
            <div className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300 transition-colors">
              <Settings className="h-4 w-4" />
              <span className="text-xs font-medium">Manage</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspace;
