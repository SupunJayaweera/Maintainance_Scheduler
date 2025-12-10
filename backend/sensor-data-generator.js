import { InfluxDB, Point } from "@influxdata/influxdb-client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// InfluxDB configuration
const token =
  process.env.INFLUXDB_TOKEN || "maintenance-token-secret-key-12345";
const org = process.env.INFLUXDB_ORG || "maintenance-org";
const bucket = process.env.INFLUXDB_BUCKET || "sensor-data";
const url = process.env.INFLUXDB_URL || "http://localhost:8086";

const writeClient = new InfluxDB({ url, token }).getWriteApi(org, bucket);

// Set default tags for all points
writeClient.useDefaultTags({ location: "factory_floor" });

// Simulate sensor data for different workspaces
const workspaceIds = [
  "68889e4d171eff841cba171a", // Example workspace IDs
  "66d123456789abcdef123457",
  "66d123456789abcdef123458",
];

// Generate realistic sensor data
function generateSensorData(workspaceId) {
  const now = new Date();

  // Add some occasional threshold violations for testing notifications
  const shouldCreateSpike = Math.random() < 0.05; // 5% chance of spike
  const spikeType = Math.floor(Math.random() * 3); // 0: current, 1: vibration, 2: temperature

  // Current sensor (0-50A with some noise and patterns)
  let baseCurrent = 25 + 10 * Math.sin(Date.now() / 60000); // 1-minute cycle
  if (shouldCreateSpike && spikeType === 0) {
    baseCurrent = 25; // Above 20A threshold for testing
  }
  const current = Math.max(0, baseCurrent + (Math.random() - 0.5) * 5);

  // Vibration data (ADXL345 accelerometer, -16g to +16g)
  let baseVibrationX = 0.1 * Math.sin(Date.now() / 5000); // 5-second cycle
  let baseVibrationY = 0.1 * Math.cos(Date.now() / 7000); // 7-second cycle
  let baseVibrationZ = 1.0 + 0.05 * Math.sin(Date.now() / 3000); // Gravity + small variation

  if (shouldCreateSpike && spikeType === 1) {
    // Create high vibration spike above 1.5g threshold
    baseVibrationX = 1.8 * (Math.random() - 0.5);
    baseVibrationY = 1.8 * (Math.random() - 0.5);
    baseVibrationZ = 1.8;
  }

  const vibrationX = baseVibrationX + (Math.random() - 0.5) * 0.2;
  const vibrationY = baseVibrationY + (Math.random() - 0.5) * 0.2;
  const vibrationZ = baseVibrationZ + (Math.random() - 0.5) * 0.1;

  // Temperature sensors (20-80°C with daily patterns)
  const hourOfDay = now.getHours();
  let dailyTempPattern = 30 + 20 * Math.sin(((hourOfDay - 6) * Math.PI) / 12); // Peak at 2 PM

  if (shouldCreateSpike && spikeType === 2) {
    dailyTempPattern = 65; // Above 60°C threshold for testing
  }

  const temperatureA = dailyTempPattern + (Math.random() - 0.5) * 3;
  const temperatureB = dailyTempPattern + 5 + (Math.random() - 0.5) * 3; // Slightly warmer

  return {
    current: parseFloat(current.toFixed(2)),
    vibrationX: parseFloat(vibrationX.toFixed(4)),
    vibrationY: parseFloat(vibrationY.toFixed(4)),
    vibrationZ: parseFloat(vibrationZ.toFixed(4)),
    temperatureA: parseFloat(temperatureA.toFixed(1)),
    temperatureB: parseFloat(temperatureB.toFixed(1)),
  };
}

// Write sensor data to InfluxDB
function writeSensorData() {
  workspaceIds.forEach((workspaceId) => {
    const sensorData = generateSensorData(workspaceId);

    // Create a point for each sensor measurement
    const point = new Point("sensor_data")
      .tag("workspace_id", workspaceId)
      .tag("sensor_type", "industrial")
      .floatField("current", sensorData.current)
      .floatField("accX", sensorData.vibrationX)
      .floatField("accY", sensorData.vibrationY)
      .floatField("accZ", sensorData.vibrationZ)
      .floatField("tempA", sensorData.temperatureA)
      .floatField("tempB", sensorData.temperatureB)
      .timestamp(new Date());

    writeClient.writePoint(point);

    console.log(
      `[${new Date().toISOString()}] Workspace ${workspaceId}: Current=${
        sensorData.current
      }A, Vibration=(${sensorData.vibrationX}, ${sensorData.vibrationY}, ${
        sensorData.vibrationZ
      })g, Temp=(${sensorData.temperatureA}, ${sensorData.temperatureB})°C`
    );
  });

  // Flush the write buffer
  writeClient.flush().catch((error) => {
    console.error("Error writing to InfluxDB:", error);
  });
}

// Generate initial historical data (last 30 minutes)
async function generateHistoricalData() {
  console.log("Generating historical sensor data...");

  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  for (
    let time = thirtyMinutesAgo;
    time <= now;
    time = new Date(time.getTime() + 10000)
  ) {
    // Every 10 seconds
    workspaceIds.forEach((workspaceId) => {
      const sensorData = generateSensorData(workspaceId);

      const point = new Point("sensor_data")
        .tag("workspace_id", workspaceId)
        .tag("sensor_type", "industrial")
        .floatField("current", sensorData.current)
        .floatField("accX", sensorData.vibrationX)
        .floatField("accY", sensorData.vibrationY)
        .floatField("accZ", sensorData.vibrationZ)
        .floatField("tempA", sensorData.temperatureA)
        .floatField("tempB", sensorData.temperatureB)
        .timestamp(time);

      writeClient.writePoint(point);
    });
  }

  await writeClient.flush();
  console.log("Historical data generation completed!");
}

// Start the data generator
async function startDataGenerator() {
  try {
    console.log("Starting sensor data generator...");
    console.log(`InfluxDB URL: ${url}`);
    console.log(`Organization: ${org}`);
    console.log(`Bucket: ${bucket}`);
    console.log(`Monitoring workspaces: ${workspaceIds.join(", ")}`);

    // Generate historical data first
    await generateHistoricalData();

    // Start real-time data generation every 10 seconds
    setInterval(() => {
      try {
        writeSensorData();
      } catch (error) {
        console.error("Error in data generation cycle:", error);
      }
    }, 10000); // Changed from 2000 to 10000 (10 seconds)

    console.log("Real-time sensor data generation started (every 10 seconds)");
  } catch (error) {
    console.error("Failed to start data generator:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down sensor data generator...");
  try {
    await writeClient.close();
    console.log("InfluxDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

// Start the generator
startDataGenerator();
