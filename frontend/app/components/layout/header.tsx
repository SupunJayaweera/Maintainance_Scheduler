import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { Button } from "../ui/button";
import {
  Bell,
  PlusCircle,
  ChevronDown,
  Activity,
  Settings,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";
import { Badge } from "../ui/badge";

interface HeaderProps {
  onWorkSpaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
  oncreateWorkspace: () => void;
}

export const Header = ({
  onWorkSpaceSelected,
  selectedWorkspace,
  oncreateWorkspace,
}: HeaderProps) => {
  const { user, logout } = useAuth();
  const loaderData = useLoaderData() as { workspaces?: Workspace[] };
  const workspaces = loaderData?.workspaces || [];
  const isOnWorkSpacePage = useLocation().pathname.includes("/workspace");
  // console.log("workspaces", workspaces);
  const navigate = useNavigate();

  const handleOnClick = (workspace: Workspace) => {
    onWorkSpaceSelected(workspace);
    const location = window.location;
    if (isOnWorkSpacePage) {
      navigate(`/workspaces/${workspace._id}`);
      // If on workspace page, just navigate to the workspace
    } else {
      const basePath = location.pathname;
      // If not on workspace page, navigate to dashboard with workspaceId
      navigate(`${basePath}?workspaceId=${workspace._id}`);
    }
  };
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 sticky top-0 z-40 border-b border-slate-700/50 backdrop-blur-md shadow-lg">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Workspace Selector */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50 hover:border-slate-600/50 min-w-[200px] justify-between group"
              >
                <div className="flex items-center gap-2">
                  {selectedWorkspace ? (
                    <>
                      {selectedWorkspace.color && (
                        <WorkspaceAvatar
                          color={selectedWorkspace.color}
                          name={selectedWorkspace.name}
                        />
                      )}
                      <span className="font-medium truncate max-w-[120px]">
                        {selectedWorkspace.name}
                      </span>
                    </>
                  ) : (
                    <span className="font-medium text-slate-300">
                      Select Workspace
                    </span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-slate-800 border-slate-700/50 text-white min-w-[250px]">
              <DropdownMenuLabel className="text-slate-300">
                Workspaces
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />

              <DropdownMenuGroup>
                {workspaces.length > 0 ? (
                  workspaces.map((ws) => (
                    <DropdownMenuItem
                      key={ws._id}
                      onClick={() => handleOnClick(ws)}
                      className="text-white hover:bg-slate-700/50 focus:bg-slate-700/50 cursor-pointer"
                    >
                      {ws.color && (
                        <WorkspaceAvatar color={ws.color} name={ws.name} />
                      )}
                      <div className="ml-2 flex-1">
                        <span className="font-medium">{ws.name}</span>
                        <div className="text-xs text-slate-400">
                          {ws.members?.length || 0} member(s)
                        </div>
                      </div>
                      {selectedWorkspace?._id === ws._id && (
                        <Activity className="h-4 w-4 text-green-400" />
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled className="text-slate-400">
                    <span>No workspaces found</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={oncreateWorkspace}
                  className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20 cursor-pointer"
                >
                  <PlusCircle className="mr-2 w-4 h-4 text-blue-400" />
                  <span className="font-medium">Create New Workspace</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Current Status Indicator */}
          {selectedWorkspace && (
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 hidden sm:flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Active
            </Badge>
          )}
        </div>

        {/* Right side - User Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-slate-800/50 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 p-2 hover:bg-slate-700/50 transition-colors group">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-white">
                    {user?.name || user?.email?.split("@")[0] || "User"}
                  </div>
                  <div className="text-xs text-slate-400">
                    {user?.email || "user@example.com"}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-slate-800 border-slate-700/50 text-white min-w-[200px]"
            >
              <DropdownMenuLabel className="text-slate-300">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  My Account
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />

              <DropdownMenuItem className="text-white hover:bg-slate-700/50 focus:bg-slate-700/50">
                <Link
                  to="/user/profile"
                  className="flex items-center gap-2 w-full"
                >
                  <User className="h-4 w-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="text-white hover:bg-slate-700/50 focus:bg-slate-700/50">
                <div className="flex items-center gap-2 w-full">
                  <Settings className="h-4 w-4" />
                  Preferences
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-700/50" />

              <DropdownMenuItem
                onClick={logout}
                className="text-red-300 hover:bg-red-500/20 focus:bg-red-500/20 cursor-pointer"
              >
                <div className="flex items-center gap-2 w-full">
                  <Bell className="h-4 w-4" />
                  Logout
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
