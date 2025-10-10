import { cn } from "@/lib/utils";
import type { Workspace } from "@/types";
import type { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
  isCollapsed: boolean;
  currentWorkspace: Workspace | null;
  className?: string;
}

export const SidebarNav = ({
  items,
  isCollapsed,
  className,
  currentWorkspace,
  ...props
}: SidebarNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className={cn("flex flex-col gap-y-2", className)} {...props}>
      {items.map((el) => {
        const Icon = el.icon;
        const isActive = location.pathname === el.href;

        const handleClick = () => {
          if (el.href === "/workspaces") {
            navigate(el.href);
          } else if (currentWorkspace && currentWorkspace._id) {
            navigate(`${el.href}?workspaceId=${currentWorkspace._id}`);
          } else {
            navigate(el.href);
          }
        };
        return (
          <Button
            variant="ghost"
            key={el.href}
            onClick={handleClick}
            className={cn(
              "justify-start group transition-all duration-200 border border-transparent",
              isActive
                ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border-blue-500/30 font-medium shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800/50 hover:border-slate-700/50",
              isCollapsed ? "w-10 h-10 p-0" : "w-full"
            )}
          >
            <Icon
              className={cn(
                "size-4 transition-colors duration-200",
                isActive
                  ? "text-blue-400"
                  : "text-slate-400 group-hover:text-white",
                isCollapsed ? "mx-auto" : "mr-3"
              )}
            />
            {!isCollapsed && <span className="font-medium">{el.title}</span>}
            {isCollapsed && <span className="sr-only">{el.title}</span>}
          </Button>
        );
      })}
    </nav>
  );
};
