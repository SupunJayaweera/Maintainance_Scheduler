import React from "react";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface IndustrialPageLayoutProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  headerBadge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    color?: string;
    icon?: LucideIcon;
  };
  headerActions?: React.ReactNode;
  className?: string;
}

export const IndustrialPageLayout = ({
  title,
  subtitle,
  icon: Icon,
  children,
  headerBadge,
  headerActions,
  className = "",
}: IndustrialPageLayoutProps) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 ${className}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-slate-400">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {headerBadge && (
              <Badge
                className={`${
                  headerBadge.color ||
                  "bg-green-500/20 text-green-300 border-green-500/30"
                } hidden sm:flex items-center gap-1`}
              >
                {headerBadge.icon && <headerBadge.icon className="w-3 h-3" />}
                {headerBadge.label}
              </Badge>
            )}
            {headerActions}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

interface IndustrialCardProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const IndustrialCard = ({
  title,
  icon: Icon,
  children,
  className = "",
}: IndustrialCardProps) => {
  return (
    <div
      className={`bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50 p-6 ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className="h-5 w-5 text-blue-400" />}
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
};

interface IndustrialLoadingProps {
  icon?: LucideIcon;
  message?: string;
}

export const IndustrialLoading = ({
  icon: Icon,
  message = "Loading...",
}: IndustrialLoadingProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        {Icon && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-lg mb-4 mx-auto w-fit">
            <Icon className="h-8 w-8 text-white animate-pulse" />
          </div>
        )}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-400">{message}</p>
      </div>
    </div>
  );
};

interface IndustrialEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const IndustrialEmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: IndustrialEmptyStateProps) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700/50 p-12 text-center">
      {Icon && <Icon className="h-16 w-16 text-slate-400 mx-auto mb-4" />}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-6">{description}</p>
      {action}
    </div>
  );
};
