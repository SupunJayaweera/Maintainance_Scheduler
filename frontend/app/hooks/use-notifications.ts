import { useState, useEffect } from "react";
import { useLatestSensorDataQuery } from "./use-sensor-data";

export interface Notification {
  id: string;
  workspaceId: string;
  workspaceName?: string;
  type: "critical" | "warning" | "info";
  category: "current" | "vibration" | "temperature" | "offline";
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
  isRead: boolean;
}

// Threshold configurations
const THRESHOLDS = {
  MAX_CURRENT: 20, // Amperes
  MAX_VIBRATION: 1.5, // g-force
  MAX_TEMPERATURE: 60, // Celsius
};

export const useNotifications = (
  workspaceId?: string,
  workspaceName?: string
) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { data: latestSensorData } = useLatestSensorDataQuery(
    workspaceId || ""
  );

  // Generate notification ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Create notification function
  const createNotification = (
    type: Notification["type"],
    category: Notification["category"],
    message: string,
    value: number,
    threshold: number
  ): Notification => ({
    id: generateId(),
    workspaceId: workspaceId || "",
    workspaceName: workspaceName || "Unknown Workspace",
    type,
    category,
    message,
    value,
    threshold,
    timestamp: new Date(),
    isRead: false,
  });

  // Check sensor thresholds
  useEffect(() => {
    if (!latestSensorData || !workspaceId) {
      return;
    }

    // Handle offline sensors - use string comparison to handle type inference issues
    if (latestSensorData.status && latestSensorData.status === "offline") {
      const offlineNotification = createNotification(
        "warning",
        "offline",
        "Sensors are offline - no data received",
        0,
        0
      );

      setNotifications((prev) => {
        const hasOfflineNotification = prev.some(
          (n) => n.category === "offline" && n.workspaceId === workspaceId
        );
        return hasOfflineNotification ? prev : [...prev, offlineNotification];
      });
      return;
    }

    const newNotifications: Notification[] = [];

    // Check current threshold
    if (latestSensorData.current > THRESHOLDS.MAX_CURRENT) {
      newNotifications.push(
        createNotification(
          "critical",
          "current",
          `Current exceeded safe limit: ${latestSensorData.current.toFixed(2)}A`,
          latestSensorData.current,
          THRESHOLDS.MAX_CURRENT
        )
      );
    }

    // Check vibration threshold (calculate magnitude)
    const vibrationMagnitude = Math.sqrt(
      latestSensorData.vibrationX ** 2 +
        latestSensorData.vibrationY ** 2 +
        latestSensorData.vibrationZ ** 2
    );

    if (vibrationMagnitude > THRESHOLDS.MAX_VIBRATION) {
      newNotifications.push(
        createNotification(
          "critical",
          "vibration",
          `Vibration exceeded safe limit: ${vibrationMagnitude.toFixed(2)}g`,
          vibrationMagnitude,
          THRESHOLDS.MAX_VIBRATION
        )
      );
    }

    // Check temperature A threshold
    if (latestSensorData.temperatureA > THRESHOLDS.MAX_TEMPERATURE) {
      newNotifications.push(
        createNotification(
          "warning",
          "temperature",
          `Temperature A exceeded safe limit: ${latestSensorData.temperatureA.toFixed(1)}°C`,
          latestSensorData.temperatureA,
          THRESHOLDS.MAX_TEMPERATURE
        )
      );
    }

    // Check temperature B threshold
    if (latestSensorData.temperatureB > THRESHOLDS.MAX_TEMPERATURE) {
      newNotifications.push(
        createNotification(
          "warning",
          "temperature",
          `Temperature B exceeded safe limit: ${latestSensorData.temperatureB.toFixed(1)}°C`,
          latestSensorData.temperatureB,
          THRESHOLDS.MAX_TEMPERATURE
        )
      );
    }

    // Only add notifications if they don't already exist (prevent duplicates)
    if (newNotifications.length > 0) {
      setNotifications((prev) => {
        const existingTypes = prev
          .filter((n) => n.workspaceId === workspaceId)
          .map((n) => `${n.category}-${n.workspaceId}`);

        const uniqueNew = newNotifications.filter(
          (n) => !existingTypes.includes(`${n.category}-${n.workspaceId}`)
        );

        return [...prev, ...uniqueNew];
      });
    }
  }, [latestSensorData, workspaceId, workspaceName]);

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Clear notification
  const clearNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    thresholds: THRESHOLDS,
  };
};
