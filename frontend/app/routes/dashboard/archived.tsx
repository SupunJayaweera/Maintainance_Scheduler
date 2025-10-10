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
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import {
  useGetArchivedWorkspacesQuery,
  useArchiveWorkspaceMutation,
} from "@/hooks/use-workspace";
import {
  useGetArchivedProjectsQuery,
  useArchiveProjectMutation,
} from "@/hooks/use-projects";
import type { Workspace, Project } from "@/types";
import { Archive, RotateCcw, Users, FolderOpen } from "lucide-react";
import React from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ArchivedWorkspaces = () => {
  const { data: workspaces, isLoading: workspacesLoading } =
    useGetArchivedWorkspacesQuery() as {
      data: Workspace[];
      isLoading: boolean;
    };

  const { data: projects, isLoading: projectsLoading } =
    useGetArchivedProjectsQuery() as {
      data: Project[];
      isLoading: boolean;
    };

  const archiveWorkspaceMutation = useArchiveWorkspaceMutation();
  const archiveProjectMutation = useArchiveProjectMutation();
  const queryClient = useQueryClient();

  const handleUnarchiveWorkspace = async (workspaceId: string) => {
    try {
      await archiveWorkspaceMutation.mutateAsync(workspaceId);

      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ["workspaces", "archived"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      toast.success("Workspace unarchived successfully");
    } catch (error) {
      console.error("Unarchive error:", error);
      toast.error("Failed to unarchive workspace");
    }
  };

  const handleUnarchiveProject = async (projectId: string) => {
    try {
      await archiveProjectMutation.mutateAsync(projectId);

      // Invalidate and refetch data
      queryClient.invalidateQueries({ queryKey: ["projects", "archived"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      toast.success("Project unarchived successfully");
    } catch (error) {
      console.error("Unarchive error:", error);
      toast.error("Failed to unarchive project");
    }
  };

  if (workspacesLoading || projectsLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-3xl font-bold">Archived Items</h2>
          <p className="text-muted-foreground">
            Manage your archived workspaces and projects
          </p>
        </div>
      </div>

      {/* Archived Workspaces Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Archived Workspaces</h3>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {workspaces && workspaces.length > 0 ? (
            workspaces.map((workspace) => (
              <ArchivedWorkspaceCard
                key={workspace._id}
                workspace={workspace}
                onUnarchive={() => handleUnarchiveWorkspace(workspace._id)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <NoDataFound
                title="No Archived Workspaces"
                description="You don't have any archived workspaces yet."
                buttonText="Go to Workspaces"
                buttonAction={() => (window.location.href = "/workspaces")}
              />
            </div>
          )}
        </div>
      </div>

      {/* Archived Projects Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Archived Projects</h3>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <ArchivedProjectCard
                key={project._id}
                project={project}
                onUnarchive={() => handleUnarchiveProject(project._id)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <NoDataFound
                title="No Archived Projects"
                description="You don't have any archived projects yet."
                buttonText="Go to Workspaces"
                buttonAction={() => (window.location.href = "/workspaces")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArchivedWorkspaceCard = ({
  workspace,
  onUnarchive,
}: {
  workspace: Workspace;
  onUnarchive: () => void;
}) => {
  return (
    <Card className="transition-all hover:-translate-y-1 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WorkspaceAvatar name={workspace.name} color={workspace.color} />
            <div>
              <CardTitle className="flex items-center gap-2">
                {workspace.name}
                <Badge variant="outline" className="text-xs">
                  <Archive className="h-3 w-3 mr-1" />
                  Archived
                </Badge>
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                Created {format(workspace.createdAt, "MM/dd/yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-xs">{workspace.members.length}</span>
          </div>
        </div>
        {workspace.description && (
          <CardDescription className="mt-2">
            {workspace.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Manage archived workspace
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUnarchive}
              title="Unarchive Workspace"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Unarchive
            </Button>
            <Link to={`/workspaces/${workspace._id}`}>
              <Button variant="default" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ArchivedProjectCard = ({
  project,
  onUnarchive,
}: {
  project: Project;
  onUnarchive: () => void;
}) => {
  return (
    <Card className="transition-all hover:-translate-y-1 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-muted rounded-lg">
              <FolderOpen className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {project.title}
                <Badge variant="outline" className="text-xs">
                  <Archive className="h-3 w-3 mr-1" />
                  Archived
                </Badge>
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                Workspace: {project.workspace?.name || "Unknown"}
              </span>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {project.status}
          </Badge>
        </div>
        {project.description && (
          <CardDescription className="mt-2">
            {project.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Manage archived project
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUnarchive}
              title="Unarchive Project"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Unarchive
            </Button>
            <Link
              to={`/workspaces/${project.workspace._id}/projects/${project._id}`}
            >
              <Button variant="default" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchivedWorkspaces;
