import { Loader } from "@/components/loader";
import CreateProjectDialog from "@/components/project/create-project";
import { InviteMemberDialog } from "@/components/workspace/invite-members";
import { ProjectList } from "@/components/workspace/project-list";

import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";

import type { Project, Workspace } from "@/types";
import { useState } from "react";
import { useParams } from "react-router";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);

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
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    console.error("Workspace fetch error:", error);
    return (
      <div>Error loading workspace: {error.message || "Unknown error"}</div>
    );
  }

  if (!data?.workspace) {
    return <div>Workspace not found</div>;
  }

  console.log("check", data);

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={data.workspace}
        members={data.workspace?.members}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
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
  );
};

export default WorkspaceDetails;
