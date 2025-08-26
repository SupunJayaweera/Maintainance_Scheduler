import { useParams } from "react-router";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";
import { useNotifications } from "@/hooks/use-notifications";

interface NotificationBellProps {
  workspaceName?: string;
}

export const NotificationBell = ({ workspaceName }: NotificationBellProps) => {
  const { workspaceId } = useParams();

  const { notifications, markAsRead, clearAll } = useNotifications(
    workspaceId || "",
    workspaceName
  );

  if (!workspaceId) {
    return null;
  }

  // Filter notifications for current workspace
  const workspaceNotifications = notifications.filter(
    (n) => n.workspaceId === workspaceId
  );

  return (
    <NotificationDropdown
      notifications={workspaceNotifications}
      onMarkAsRead={markAsRead}
      onClearAll={clearAll}
    />
  );
};
