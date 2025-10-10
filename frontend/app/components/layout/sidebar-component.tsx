import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  Users,
  Wrench,
  Activity,
  BarChart3,
  Archive,
} from "lucide-react";
import React, { useState } from "react";
import { Link, type href } from "react-router";
import { is } from "zod/v4/locales";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

const SidebarComponent = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Workspaces", href: "/workspaces", icon: Users },
    // { title: "Analytics", href: "/analytics", icon: BarChart3 },
    { title: "My Tasks", href: "/my-tasks", icon: ListCheck },
    { title: "Members", href: "/members", icon: Users },
    { title: "Archived", href: "/archived", icon: Archive },
    // { title: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div
      className={cn(
        "flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 backdrop-blur-md transition-all duration-300",
        isCollapsed ? "w-16 md:w-[80px]" : "w-16 md:w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b border-slate-700/50 px-4 mb-4">
        <Link to="/dashboard" className="flex items-center group">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-200">
                <Wrench className="size-5 text-white" />
              </div>
              <div className="hidden md:block">
                <span className="font-bold text-white text-lg tracking-tight">
                  MaintenancePro
                </span>
                <div className="text-xs text-slate-400 -mt-1">
                  Industrial IoT
                </div>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-200">
              <Wrench className="size-5 text-white" />
            </div>
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden md:flex text-slate-400 hover:text-white hover:bg-slate-800/50 border-slate-700/50"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </Button>
      </div>
      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          className={cn(isCollapsed && "items-center space-y-3")}
          currentWorkspace={currentWorkspace}
        />
      </ScrollArea>

      {/* Current Workspace Display */}
      {!isCollapsed && currentWorkspace && (
        <div className="px-4 py-3 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400 uppercase tracking-wide">
                Active Workspace
              </span>
            </div>
            <p className="text-sm font-medium text-white truncate">
              {currentWorkspace.name}
            </p>
            <p className="text-xs text-slate-400">
              {currentWorkspace.members?.length || 0} member(s)
            </p>
          </div>
        </div>
      )}

      {/* User Section & Logout */}
      <div className="border-t border-slate-700/50 p-3">
        {!isCollapsed && user && (
          <div className="mb-3 px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-200"
          onClick={() => logout()}
        >
          <LogOut className={cn("size-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && <span className="hidden md:block">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default SidebarComponent;
