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
  IndustrialPageLayout,
  IndustrialCard,
  IndustrialLoading,
  IndustrialEmptyState,
} from "@/components/layout/industrial-page-layout";
import {
  useGetArchivedWorkspacesQuery,
  useArchiveWorkspaceMutation,
} from "@/hooks/use-workspace";
import {
  useGetArchivedProjectsQuery,
  useArchiveProjectMutation,
} from "@/hooks/use-projects";
import type { Workspace, Project } from "@/types";
import {
  Archive,
  RotateCcw,
  Users,
  FolderOpen,
  Activity,
  Building2,
} from "lucide-react";
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
    return (
      <IndustrialLoading icon={Archive} message="Loading archived items..." />
    );
  }

  return (
    <IndustrialPageLayout
      title="Archived Industrial Items"
      subtitle="Manage archived workspaces and projects"
      icon={Archive}
      headerBadge={{
        label: `${(workspaces?.length || 0) + (projects?.length || 0)} Archived Items`,
        color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
        icon: Activity,
      }}
    >
      {/* Archived Workspaces Section */}
      <IndustrialCard title="Archived Workspaces" icon={Building2}>
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
              <IndustrialEmptyState
                icon={Building2}
                title="No Archived Workspaces"
                description="You don't have any archived workspaces yet."
                action={
                  <Button
                    onClick={() => (window.location.href = "/workspaces")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    Go to Workspaces
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </IndustrialCard>

      {/* Archived Projects Section */}
      <IndustrialCard title="Archived Projects" icon={FolderOpen}>
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
              <IndustrialEmptyState
                icon={FolderOpen}
                title="No Archived Projects"
                description="You don't have any archived projects yet."
                action={
                  <Button
                    onClick={() => (window.location.href = "/workspaces")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    Go to Workspaces
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </IndustrialCard>
    </IndustrialPageLayout>
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
    <Card className="bg-slate-700/30 backdrop-blur-md border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <WorkspaceAvatar name={workspace.name} color={workspace.color} />
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                {workspace.name}
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-500/20 text-orange-300 border-orange-500/30"
                >
                  <Archive className="h-3 w-3 mr-1" />
                  Archived
                </Badge>
              </CardTitle>
              <span className="text-sm text-slate-400">
                Created {format(workspace.createdAt, "MM/dd/yyyy")}
              </span>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-slate-600/50 text-slate-300 text-xs"
          >
            <Users className="h-3 w-3 mr-1" />
            {workspace.members.length}
          </Badge>
        </div>
        {workspace.description && (
          <CardDescription className="text-slate-300 line-clamp-2">
            {workspace.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Manage archived workspace
          </div>
          <div className="flex gap-2 m-2">
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
    <Card className="bg-slate-700/30 backdrop-blur-md border-slate-600/50 hover:border-slate-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
              <FolderOpen className="h-4 w-4 text-orange-300" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                {project.title}
                <Badge
                  variant="outline"
                  className="text-xs bg-orange-500/20 text-orange-300 border-orange-500/30"
                >
                  <Archive className="h-3 w-3 mr-1" />
                  Archived
                </Badge>
              </CardTitle>
              <span className="text-sm text-slate-400">
                Workspace: {project.workspace?.name || "Unknown"}
              </span>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-slate-600/50 text-slate-300 text-xs"
          >
            {project.status}
          </Badge>
        </div>
        {project.description && (
          <CardDescription className="text-slate-300 line-clamp-2">
            {project.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">Manage archived project</div>
          <div className="flex gap-2 m-2">
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
