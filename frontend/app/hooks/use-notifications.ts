import { useState, useEffect } from "react";
import { useLatestSensorDataQuery } from "./use-sensor-data";

interface SensorData {
  timestamp: string;
  current: number;
  vibrationX: number;
  vibrationY: number;
  vibrationZ: number;
  temperatureA: number;
  temperatureB: number;
  status?: "online" | "offline";
  message?: string;
  lastSeen?: string;
}

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
  CURRENT: { max: 3.5 }, // Amperes
  TEMP_A: { max: 45.0 }, // Celsius
  TEMP_B: { max: 45.0 }, // Celsius
  VIBRATION_MAGNITUDE: { max: 12.0 }, // g-force (resultant of 3 axes)
};

export const useNotifications = (
  workspaceId?: string,
  workspaceName?: string
) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { data: latestSensorData } = useLatestSensorDataQuery(
    workspaceId || ""
  ) as { data: SensorData | null | undefined };

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
    if (latestSensorData.current > THRESHOLDS.CURRENT.max) {
      newNotifications.push(
        createNotification(
          "critical",
          "current",
          `Current exceeded safe limit: ${latestSensorData.current.toFixed(2)}A (max: ${THRESHOLDS.CURRENT.max}A)`,
          latestSensorData.current,
          THRESHOLDS.CURRENT.max
        )
      );
    }

    // Check vibration magnitude (resultant of 3 axes)
    const vibrationMagnitude = Math.sqrt(
      latestSensorData.vibrationX ** 2 +
        latestSensorData.vibrationY ** 2 +
        latestSensorData.vibrationZ ** 2
    );

    if (vibrationMagnitude > THRESHOLDS.VIBRATION_MAGNITUDE.max) {
      newNotifications.push(
        createNotification(
          "warning",
          "vibration",
          `Vibration magnitude exceeded safe limit: ${vibrationMagnitude.toFixed(2)}g (max: ${THRESHOLDS.VIBRATION_MAGNITUDE.max}g)`,
          vibrationMagnitude,
          THRESHOLDS.VIBRATION_MAGNITUDE.max
        )
      );
    }

    // Check temperature A threshold
    if (latestSensorData.temperatureA > THRESHOLDS.TEMP_A.max) {
      newNotifications.push(
        createNotification(
          "warning",
          "temperature",
          `Temperature A exceeded safe limit: ${latestSensorData.temperatureA.toFixed(1)}°C (max: ${THRESHOLDS.TEMP_A.max}°C)`,
          latestSensorData.temperatureA,
          THRESHOLDS.TEMP_A.max
        )
      );
    }

    // Check temperature B threshold
    if (latestSensorData.temperatureB > THRESHOLDS.TEMP_B.max) {
      newNotifications.push(
        createNotification(
          "warning",
          "temperature",
          `Temperature B exceeded safe limit: ${latestSensorData.temperatureB.toFixed(1)}°C (max: ${THRESHOLDS.TEMP_B.max}°C)`,
          latestSensorData.temperatureB,
          THRESHOLDS.TEMP_B.max
        )
      );
    }

    // Only add notifications if they don't already exist (prevent duplicates)
    if (newNotifications.length > 0) {
      setNotifications((prev) => {
        const existingKeys = prev
          .filter((n) => n.workspaceId === workspaceId && !n.isRead)
          .map(
            (n) =>
              `${n.category}-${n.message.substring(0, 30)}-${n.workspaceId}`
          );

        const uniqueNew = newNotifications.filter(
          (n) =>
            !existingKeys.includes(
              `${n.category}-${n.message.substring(0, 30)}-${n.workspaceId}`
            )
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
