import { InfluxDB } from "@influxdata/influxdb-client";

// InfluxDB configuration
const token = process.env.INFLUXDB_TOKEN || "your-influxdb-token";
const org = process.env.INFLUXDB_ORG || "maintenance-org";
const bucket = process.env.INFLUXDB_BUCKET || "sensor-data";
const url = process.env.INFLUXDB_URL || "http://localhost:8086";

const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

const getSensorData = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { timeRange = "10m" } = req.query; // Default to last 10 minutes

    const query = `
      from(bucket: "${bucket}")
        |> range(start: -${timeRange})
        |> filter(fn: (r) => r["_measurement"] == "sensor_data")
        |> filter(fn: (r) => r["workspace_id"] == "${workspaceId}")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: false)
    `;

    const result = [];

    return new Promise((resolve, reject) => {
      queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          result.push({
            timestamp: o._time,
            current: o.current || 0,
            vibrationX: o.accX || 0,
            vibrationY: o.accY || 0,
            vibrationZ: o.accZ || 0,
            temperatureA: o.tempA || 0,
            temperatureB: o.tempB || 0,
          });
        },
        error(error) {
          console.error("Query error:", error);
          reject(error);
        },
        complete() {
          resolve(result);
        },
      });
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        console.error("InfluxDB query error:", error);
        res.status(500).json({
          message: "Failed to fetch sensor data",
          error: error.message,
        });
      });
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getLatestSensorReading = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const query = `
      from(bucket: "${bucket}")
        |> range(start: -1h)
        |> filter(fn: (r) => r["_measurement"] == "sensor_data")
        |> filter(fn: (r) => r["workspace_id"] == "${workspaceId}")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: true)
        |> limit(n: 1)
    `;

    const result = [];

    return new Promise((resolve, reject) => {
      queryApi.queryRows(query, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          result.push({
            timestamp: o._time,
            current: o.current || 0,
            vibrationX: o.accX || 0,
            vibrationY: o.accY || 0,
            vibrationZ: o.accZ || 0,
            temperatureA: o.tempA || 0,
            temperatureB: o.tempB || 0,
          });
        },
        error(error) {
          console.error("Query error:", error);
          reject(error);
        },
        complete() {
          resolve(result);
        },
      });
    })
      .then((data) => {
        const latestReading = data[0];

        if (!latestReading) {
          // No data found - sensors offline
          return res.status(200).json({
            timestamp: new Date().toISOString(),
            current: 0,
            vibrationX: 0,
            vibrationY: 0,
            vibrationZ: 0,
            temperatureA: 0,
            temperatureB: 0,
            status: "offline",
            message: "Sensors are offline",
          });
        }

        // Check if the latest reading is older than 1 minute (60 seconds)
        const lastDataTime = new Date(latestReading.timestamp);
        const currentTime = new Date();
        const timeDifference = (currentTime - lastDataTime) / 1000; // in seconds

        if (timeDifference > 60) {
          // Data is older than 1 minute - sensors offline
          return res.status(200).json({
            timestamp: new Date().toISOString(),
            current: 0,
            vibrationX: 0,
            vibrationY: 0,
            vibrationZ: 0,
            temperatureA: 0,
            temperatureB: 0,
            status: "offline",
            message: "Sensors are offline",
            lastSeen: latestReading.timestamp,
          });
        }

        // Data is fresh - sensors online
        res.status(200).json({
          ...latestReading,
          status: "online",
          message: "Sensors are online",
        });
      })
      .catch((error) => {
        console.error("InfluxDB query error:", error);
        res.status(500).json({
          message: "Failed to fetch latest sensor data",
          error: error.message,
        });
      });
  } catch (error) {
    console.error("Error fetching latest sensor data:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { getSensorData, getLatestSensorReading };
