import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/fetch-utils";

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

export const useSensorDataQuery = (
  workspaceId: string,
  timeRange: string = "10m"
) => {
  return useQuery({
    queryKey: ["sensor-data", workspaceId, timeRange],
    queryFn: async (): Promise<SensorData[]> => {
      return fetchData<SensorData[]>(
        `/sensors/${workspaceId}/data?timeRange=${timeRange}`
      );
    },
    refetchInterval: 3000, // Refetch every 3 seconds for near real-time updates
    staleTime: 0, // Always consider data stale, fetch fresh data
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when internet reconnects
    cacheTime: 2000, // Keep cache for only 2 seconds
  });
};

export const useLatestSensorDataQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["latest-sensor-data", workspaceId],
    queryFn: async (): Promise<SensorData | null> => {
      return fetchData<SensorData | null>(`/sensors/${workspaceId}/latest`);
    },
    refetchInterval: 3000, // Refetch every 3 seconds for latest data
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when internet reconnects
    cacheTime: 2000, // Keep cache for only 2 seconds
  });
};
