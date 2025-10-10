import CreateProjectDialog from "@/components/project/create-project";
import { InviteMemberDialog } from "@/components/workspace/invite-members";
import { ProjectList } from "@/components/workspace/project-list";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import {
  IndustrialPageLayout,
  IndustrialLoading,
} from "@/components/layout/industrial-page-layout";
import {
  useGetWorkspaceQuery,
  useArchiveWorkspaceMutation,
} from "@/hooks/use-workspace";

import type { Project, Workspace } from "@/types";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building } from "lucide-react";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const archiveWorkspaceMutation = useArchiveWorkspaceMutation();

  if (!workspaceId) {
    return <div>No workspace found</div>;
  }

  const { data, isLoading, error } = useGetWorkspaceQuery(workspaceId) as {
    data: {
      workspace: Workspace;
      projects: Project[];
    };
    isLoading: boolean;
    error: any;
  };

  // console.log("Query state:", { data, isLoading, error });

  if (isLoading) {
    return <IndustrialLoading message="Loading workspace details..." />;
  }

  if (error) {
    console.error("Workspace fetch error:", error);
    return (
      <IndustrialPageLayout
        title="Error"
        subtitle="Failed to load workspace"
        icon={Building}
      >
        <div className="text-center py-8">
          <p className="text-slate-400">
            Error loading workspace: {error.message || "Unknown error"}
          </p>
        </div>
      </IndustrialPageLayout>
    );
  }

  if (!data?.workspace) {
    return (
      <IndustrialPageLayout
        title="Not Found"
        subtitle="Workspace not found"
        icon={Building}
      >
        <div className="text-center py-8">
          <p className="text-slate-400">
            The requested workspace could not be found.
          </p>
        </div>
      </IndustrialPageLayout>
    );
  }

  console.log("check", data);

  const handleArchiveWorkspace = async () => {
    if (!workspaceId) return;

    try {
      await archiveWorkspaceMutation.mutateAsync(workspaceId);

      // Invalidate and refetch workspace data
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      toast.success(
        data.workspace.isArchived
          ? "Workspace unarchived successfully"
          : "Workspace archived successfully"
      );

      // Navigate back to workspaces list
      navigate("/workspaces");
    } catch (error) {
      console.error("Archive error:", error);
      toast.error("Failed to archive/unarchive workspace");
    }
  };

  return (
    <IndustrialPageLayout
      title={data.workspace.name}
      subtitle="Workspace Overview"
      icon={Building}
    >
      <div className="space-y-6">
        <WorkspaceHeader
          workspace={data.workspace}
          members={data.workspace?.members}
          onCreateProject={() => setIsCreateProject(true)}
          onInviteMember={() => setIsInviteMember(true)}
          onArchiveWorkspace={handleArchiveWorkspace}
        />

        <ProjectList
          workspaceId={workspaceId}
          projects={data.projects || []}
          onCreateProject={() => setIsCreateProject(true)}
        />

        <CreateProjectDialog
          isOpen={isCreateProject}
          onOpenChange={setIsCreateProject}
          workspaceId={workspaceId}
          workspaceMembers={data.workspace.members as any}
        />

        <InviteMemberDialog
          isOpen={isInviteMember}
          onOpenChange={setIsInviteMember}
          workspaceId={workspaceId}
        />
      </div>
    </IndustrialPageLayout>
  );
};

export default WorkspaceDetails;
