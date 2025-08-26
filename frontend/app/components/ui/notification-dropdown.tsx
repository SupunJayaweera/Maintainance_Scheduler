import { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Zap,
  Thermometer,
  WifiOff,
  X,
} from "lucide-react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import type { Notification } from "@/hooks/use-notifications";

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const getNotificationIcon = (category: string) => {
  switch (category) {
    case "current":
      return <Zap className="h-4 w-4 text-yellow-500" />;
    case "vibration":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case "temperature":
      return <Thermometer className="h-4 w-4 text-red-500" />;
    case "offline":
      return <WifiOff className="h-4 w-4 text-gray-500" />;
    default:
      return <Bell className="h-4 w-4 text-blue-500" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "critical":
      return "border-l-red-500 bg-red-50";
    case "warning":
      return "border-l-yellow-500 bg-yellow-50";
    case "info":
      return "border-l-blue-500 bg-blue-50";
    default:
      return "border-l-gray-500 bg-gray-50";
  }
};

const formatTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - timestamp.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
};

export const NotificationDropdown = ({
  notifications,
  onMarkAsRead,
  onClearAll,
}: NotificationDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 z-50 bg-white border border-gray-200 rounded-lg shadow-lg">
          <Card className="border-0 shadow-none">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <CardDescription>
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                      : "All caught up!"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onClearAll();
                        setIsOpen(false);
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {sortedNotifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {sortedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                        !notification.isRead
                          ? "bg-opacity-100"
                          : "bg-opacity-50"
                      } hover:bg-opacity-75 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0`}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p
                              className={`text-sm font-medium ${
                                !notification.isRead
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.workspaceName ||
                                "Unknown Workspace"}
                            </p>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                notification.type === "critical"
                                  ? "bg-red-100 text-red-800"
                                  : notification.type === "warning"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {notification.type}
                            </span>
                          </div>
                          <p
                            className={`text-sm ${
                              !notification.isRead
                                ? "text-gray-800"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.message}
                          </p>
                          {notification.value > 0 &&
                            notification.threshold > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                Value: {notification.value.toFixed(1)} |
                                Threshold: {notification.threshold}
                              </p>
                            )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
