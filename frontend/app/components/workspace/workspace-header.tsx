import type { User, Workspace } from "@/types";
import { WorkspaceAvatar } from "./workspace-avatar";
import { Button } from "../ui/button";
import { Archive, Plus, UserPlus, BarChart3 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/provider/auth-context";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

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

  const handleAnalyticsClick = () => {
    navigate(`/workspaces/${workspace._id}/analytics`);
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50 p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex md:items-center gap-4">
            {workspace.color && (
              <WorkspaceAvatar color={workspace.color} name={workspace.name} />
            )}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                {workspace.name}
              </h2>
              <p className="text-slate-400 text-sm">
                Industrial Maintenance Facility
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-between md:justify-start mb-4 md:mb-0 flex-wrap">
            <Button
              variant="secondary"
              onClick={handleAnalyticsClick}
              className="bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-white border-slate-600"
            >
              <BarChart3 className="size-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant="outline"
              onClick={onInviteMember}
              className="bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-white border-slate-600"
            >
              <UserPlus className="size-4 mr-2" />
              Invite Member
            </Button>
            <Button
              onClick={onCreateProject}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              <Plus className="size-4 mr-2" />
              Create Job
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
                className="bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
              >
                <Archive className="size-4 mr-2" />
                {workspace.isArchived ? "Unarchive" : "Archive"}
              </Button>
            )}
          </div>
        </div>

        {workspace.description && (
          <p className="text-sm md:text-base text-slate-300 bg-slate-700/30 rounded-lg p-3 border-l-4 border-blue-500/50">
            {workspace.description}
          </p>
        )}
      </div>

      {members && members.length > 0 && (
        <div className="flex items-center gap-4 bg-slate-700/20 rounded-lg p-3">
          <span className="text-sm text-slate-300 font-medium flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Team Members ({members.length})
          </span>

          <div className="flex space-x-2">
            {members.slice(0, 8).map((member) => (
              <Avatar
                key={member.user._id}
                className="relative h-8 w-8 rounded-full border-2 border-slate-600 hover:border-blue-500/50 transition-colors overflow-hidden"
                title={`${member.user.name} - ${member.role}`}
              >
                <AvatarImage
                  src={member.user.profilePicture}
                  alt={member.user.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold text-xs">
                  {member.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {members.length > 8 && (
              <div className="h-8 w-8 rounded-full bg-slate-600/50 border-2 border-slate-500 flex items-center justify-center">
                <span className="text-xs text-slate-300 font-medium">
                  +{members.length - 8}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
