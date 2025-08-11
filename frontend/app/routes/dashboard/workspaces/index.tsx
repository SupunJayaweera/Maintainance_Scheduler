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
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types";
import { PlusCircle, Users } from "lucide-react";
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
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold">Machine Workspaces</h2>
          <Button onClick={() => setIsCreatingWorkspace(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Workspace
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} />
          ))}
          {workspaces.length === 0 && (
            <NoDataFound
              title="No Workspaces Found"
              description="Looks like you don't have any workspaces yet."
              buttonText="Create Workspace"
              buttonAction={() => setIsCreatingWorkspace(true)}
            />
          )}
        </div>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="transition-all hover:-translate-y-1 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WorkspaceAvatar name={workspace.name} color={workspace.color} />
              <div>
                <CardTitle>{workspace.name}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Created at {format(workspace.createdAt, "MM/dd/yyyy hh:mm a")}
                </span>
              </div>
            </div>
            <div className="flex items-center  text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-xs">{workspace.members.length} </span>
            </div>
          </div>
          <CardDescription className="mt-2">
            {workspace.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            View Work Space Details and Jobs
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspace;
