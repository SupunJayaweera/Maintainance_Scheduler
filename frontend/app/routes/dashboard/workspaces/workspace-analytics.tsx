import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, Thermometer, Zap, Vibrate } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  useSensorDataQuery,
  useLatestSensorDataQuery,
} from "@/hooks/use-sensor-data";

interface SensorData {
  timestamp: string;
  current: number;
  vibrationX: number;
  vibrationY: number;
  vibrationZ: number;
  temperatureA: number;
  temperatureB: number;
}

const WorkspaceAnalytics = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();

  if (!workspaceId) {
    return <div>No workspace ID provided</div>;
  }

  const {
    data: latestSensorReading,
    isLoading: latestLoading,
    error: latestError,
  } = useLatestSensorDataQuery(workspaceId);

  // Dynamic time range based on sensor status
  const timeRange = latestSensorReading?.status === "offline" ? "5m" : "30m";

  const {
    data: sensorData = [],
    isLoading,
    error,
  } = useSensorDataQuery(workspaceId, timeRange);

  // Connection status based on API and sensor status
  const isApiConnected = !error && !isLoading;
  const isSensorOnline = latestSensorReading?.status === "online";
  const isConnected = isApiConnected && isSensorOnline;

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Create enhanced sensor data that shows offline behavior correctly
  const getEnhancedSensorData = () => {
    if (latestSensorReading?.status === "offline" && sensorData.length > 0) {
      // When sensors are offline, we need to:
      // 1. Keep historical data up to the last real reading
      // 2. Add a clear "offline" segment showing zeros

      const lastRealDataTime = latestSensorReading.lastSeen
        ? new Date(latestSensorReading.lastSeen)
        : new Date(sensorData[sensorData.length - 1].timestamp);

      // Filter out any data newer than the last real reading
      const filteredHistoricalData = sensorData.filter((item) => {
        const itemTime = new Date(item.timestamp);
        return itemTime <= lastRealDataTime;
      });

      // Add one zero entry right after the last real data to show the disconnect
      const offlineStartTime = new Date(lastRealDataTime.getTime() + 60000); // 1 minute after last real data
      const currentTime = new Date();

      const zeroEntries = [
        // Entry showing when sensors went offline
        {
          timestamp: offlineStartTime.toISOString(),
          current: 0,
          vibrationX: 0,
          vibrationY: 0,
          vibrationZ: 0,
          temperatureA: 0,
          temperatureB: 0,
        },
        // Current time entry showing continued offline status
        {
          timestamp: currentTime.toISOString(),
          current: 0,
          vibrationX: 0,
          vibrationY: 0,
          vibrationZ: 0,
          temperatureA: 0,
          temperatureB: 0,
        },
      ];

      return [...filteredHistoricalData, ...zeroEntries];
    }
    return sensorData;
  };

  const enhancedSensorData = getEnhancedSensorData();

  const currentData = enhancedSensorData.map((item) => ({
    time: formatTime(item.timestamp),
    value: item.current,
  }));

  const vibrationData = enhancedSensorData.map((item) => ({
    time: formatTime(item.timestamp),
    x: item.vibrationX,
    y: item.vibrationY,
    z: item.vibrationZ,
  }));

  const temperatureData = enhancedSensorData.map((item) => ({
    time: formatTime(item.timestamp),
    sensorA: item.temperatureA,
    sensorB: item.temperatureB,
  }));

  const latestData = enhancedSensorData[enhancedSensorData.length - 1];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading sensor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/workspaces/${workspaceId}`)}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Workspace
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Real-time Analytics</h1>
          <p className="text-muted-foreground">
            Live sensor data monitoring
            <span
              className={`ml-2 inline-block w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            <span className="ml-1 text-sm">
              {latestSensorReading?.status === "offline"
                ? `Sensors Offline ${latestSensorReading.lastSeen ? `(Last seen: ${formatTime(latestSensorReading.lastSeen)})` : ""}`
                : isConnected
                  ? "Sensors Online"
                  : "Connecting..."}
            </span>
          </p>
        </div>
      </div>

      {/* Current Status Cards */}
      {latestSensorReading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestSensorReading.current.toFixed(2)} A
              </div>
              <p className="text-xs text-muted-foreground">
                {latestSensorReading.status === "offline"
                  ? "Sensors offline"
                  : "Real-time current measurement"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vibration</CardTitle>
              <Vibrate className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.sqrt(
                  latestSensorReading.vibrationX ** 2 +
                    latestSensorReading.vibrationY ** 2 +
                    latestSensorReading.vibrationZ ** 2
                ).toFixed(2)}{" "}
                g
              </div>
              <p className="text-xs text-muted-foreground">
                {latestSensorReading.status === "offline"
                  ? "Sensors offline"
                  : "Combined acceleration magnitude"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Temperature A
              </CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestSensorReading.temperatureA.toFixed(1)}°C
              </div>
              <p className="text-xs text-muted-foreground">
                {latestSensorReading.status === "offline"
                  ? "Sensors offline"
                  : "Primary temperature sensor"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Temperature B
              </CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestSensorReading.temperatureB.toFixed(1)}°C
              </div>
              <p className="text-xs text-muted-foreground">
                {latestSensorReading.status === "offline"
                  ? "Sensors offline"
                  : "Secondary temperature sensor"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Current Measurement
            </CardTitle>
            <CardDescription>
              Real-time current readings in Amperes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px]"
              config={{
                current: {
                  label: "Current (A)",
                  color: "#2563eb",
                },
              }}
            >
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  name="Current (A)"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Vibration Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vibrate className="h-5 w-5" />
              Vibration (ADXL345)
            </CardTitle>
            <CardDescription>
              3-axis acceleration data in g-force
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px]"
              config={{
                x: {
                  label: "X-axis",
                  color: "#dc2626",
                },
                y: {
                  label: "Y-axis",
                  color: "#16a34a",
                },
                z: {
                  label: "Z-axis",
                  color: "#2563eb",
                },
              }}
            >
              <LineChart data={vibrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="x"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={false}
                  name="X-axis (g)"
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                  name="Y-axis (g)"
                />
                <Line
                  type="monotone"
                  dataKey="z"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  name="Z-axis (g)"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Temperature Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Temperature Sensors
            </CardTitle>
            <CardDescription>
              Temperature readings from sensors A and B in Celsius
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px]"
              config={{
                sensorA: {
                  label: "Temperature A",
                  color: "#f59e0b",
                },
                sensorB: {
                  label: "Temperature B",
                  color: "#ef4444",
                },
              }}
            >
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="sensorA"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Temperature A (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="sensorB"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  name="Temperature B (°C)"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {!isConnected && (
        <Card
          className={`border-yellow-200 ${latestSensorReading?.status === "offline" ? "bg-red-50 border-red-200" : "bg-yellow-50"}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity
                className={`h-5 w-5 ${latestSensorReading?.status === "offline" ? "text-red-600" : "text-yellow-600"}`}
              />
              <div>
                <h3
                  className={`font-medium ${latestSensorReading?.status === "offline" ? "text-red-800" : "text-yellow-800"}`}
                >
                  {latestSensorReading?.status === "offline"
                    ? "Sensors Offline"
                    : "Connection Issue"}
                </h3>
                <p
                  className={`text-sm ${latestSensorReading?.status === "offline" ? "text-red-700" : "text-yellow-700"}`}
                >
                  {latestSensorReading?.status === "offline"
                    ? `Sensors have been offline for more than 1 minute. ${latestSensorReading.lastSeen ? `Last seen: ${formatTime(latestSensorReading.lastSeen)}` : ""}`
                    : "Unable to connect to sensor data source. Please check if the InfluxDB service is running."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkspaceAnalytics;
