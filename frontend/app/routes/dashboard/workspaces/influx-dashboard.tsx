import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchData } from "@/lib/fetch-utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function InfluxDashboard() {
  const { workspaceId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["influxData", workspaceId],
    queryFn: async () => {
      return await fetchData(
        `/influx/workspace/${workspaceId}/task-status-data`
      );
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  if (isLoading) return <div>Loading InfluxDB data...</div>;
  if (error) return <div>Error loading InfluxDB data: {error.message}</div>;
  if (!data || !Array.isArray(data)) return <div>No data available</div>;

  // Process data for Recharts
  const processedData = data.reduce((acc: any[], item: any) => {
    const existing = acc.find((d: any) => d.time === item.time);
    if (existing) {
      existing[item.status] = item.count;
    } else {
      acc.push({ time: item.time, [item.status]: item.count });
    }
    return acc;
  }, []);

  // Extract all unique statuses for legend and lines
  const statuses = Array.from(new Set(data.map((item: any) => item.status)));

  return (
    <div className="h-[400px] w-full">
      <h2 className="text-xl font-bold mb-4">Task Status Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={processedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {statuses.map((status: string) => (
            <Line
              key={status}
              type="monotone"
              dataKey={status}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each status
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
