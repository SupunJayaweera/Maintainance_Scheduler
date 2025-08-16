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
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
    staleTime: 1000, // Consider data stale after 1 second
  });
};

export const useLatestSensorDataQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["latest-sensor-data", workspaceId],
    queryFn: async (): Promise<SensorData | null> => {
      return fetchData<SensorData | null>(`/sensors/${workspaceId}/latest`);
    },
    refetchInterval: 1000, // Refetch every 1 second for latest data
    staleTime: 500, // Consider data stale after 0.5 seconds
  });
};
