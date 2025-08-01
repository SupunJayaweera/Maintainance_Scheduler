import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
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
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };
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
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedWorkspace ? (
                <>
                  {selectedWorkspace.color && (
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                    />
                  )}
                  <span className="font-medium ">{selectedWorkspace.name}</span>
                </>
              ) : (
                <span className="font-medium ">Select Workspace</span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws._id}
                  onClick={() => handleOnClick(ws)}
                >
                  {ws.color && (
                    <WorkspaceAvatar color={ws.color} name={ws.name} />
                  )}
                  <span className="ml-2">{ws.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={oncreateWorkspace}>
                <PlusCircle className="mr-2 w-4 h-4" />
                Create New Workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full border p-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="bg-black text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/user/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
