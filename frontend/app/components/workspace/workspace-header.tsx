import type { User, Workspace } from "@/types";
import { WorkspaceAvatar } from "./workspace-avatar";
import { Button } from "../ui/button";
import { Archive, Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/provider/auth-context";

interface WorkspaceHeaderProps {
  workspace?: Workspace;
  members?: {
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
  }[];
  onCreateProject: () => void;
  onInviteMember: () => void;
  onArchiveWorkspace?: () => void;
}

export const WorkspaceHeader = ({
  workspace,
  members,
  onCreateProject,
  onInviteMember,
  onArchiveWorkspace,
}: WorkspaceHeaderProps) => {
  const { user } = useAuth();

  // Add debugging
  // console.log("WorkspaceHeader received:", { workspace, members });

  // Add null check to prevent crashes
  if (!workspace) {
    return <div>Loading workspace...</div>;
  }

  // Check if current user is owner or admin
  const currentUserMember = members?.find(
    (member) => member.user._id === user?._id
  );
  const canArchive =
    currentUserMember?.role === "owner" || currentUserMember?.role === "admin";

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3">
          <div className="flex md:items-center gap-3">
            {workspace.color && (
              <WorkspaceAvatar color={workspace.color} name={workspace.name} />
            )}

            <h2 className="text-xl md:text-2xl font-semibold">
              {workspace.name}
            </h2>
          </div>

          <div className="flex items-center gap-3 justify-between md:justify-start mb-4 md:mb-0">
            <Button variant={"outline"} onClick={onInviteMember}>
              <UserPlus className="size-4 mr-2" />
              Invite Member
            </Button>
            <Button onClick={onCreateProject}>
              <Plus className="size-4 mr-2" />
              Create a Job
            </Button>
            {canArchive && onArchiveWorkspace && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onArchiveWorkspace}
                title={
                  workspace.isArchived
                    ? "Unarchive Workspace"
                    : "Archive Workspace"
                }
              >
                <Archive className="size-4 mr-2" />
                {workspace.isArchived ? "Unarchive" : "Archive"}
              </Button>
            )}
          </div>
        </div>

        {workspace.description && (
          <p className="text-sm md:text-base text-muted-foreground">
            {workspace.description}
          </p>
        )}
      </div>

      {members && members.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Members</span>

          <div className="flex space-x-2">
            {members.map((member) => (
              <Avatar
                key={member.user._id}
                className="relative h-8 w-8 rounded-full  border-2 border-background overflow-hidden"
                title={member.user.name}
              >
                <AvatarImage
                  src={member.user.profilePicture}
                  alt={member.user.name}
                />
                <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
