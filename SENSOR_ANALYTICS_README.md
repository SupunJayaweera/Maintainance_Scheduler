# Real-time Sensor Analytics Setup

This guide will help you set up the real-time sensor analytics system with InfluxDB.

## Prerequisites

- Docker and Docker Compose installed
- Node.js environment set up

## Setup Instructions

### 1. Start InfluxDB with Docker

```bash
# Start InfluxDB container
docker-compose -f docker-compose.influxdb.yml up -d

# Check if InfluxDB is running
docker ps
```

InfluxDB will be available at:

- **InfluxDB UI**: http://localhost:8086
- **Chronograf UI**: http://localhost:8888

### 2. InfluxDB Initial Setup

The Docker container will automatically set up InfluxDB with:

- **Username**: admin
- **Password**: adminpassword
- **Organization**: maintenance-org
- **Bucket**: sensor-data
- **Token**: maintenance-token-secret-key-12345

### 3. Verify InfluxDB Connection

1. Open http://localhost:8086 in your browser
2. Login with username: `admin` and password: `adminpassword`
3. Navigate to "Data Explorer" to verify the setup

### 4. Start the Sensor Data Generator

```bash
# In the backend directory
cd backend
node sensor-data-generator.js
```

This will:

- Generate 30 minutes of historical sensor data
- Start real-time data generation every 10 seconds
- Monitor multiple workspace IDs with realistic sensor patterns

### 5. Test the Analytics API

```bash
# Get sensor data for a workspace
curl "http://localhost:5000/api/sensors/66d123456789abcdef123456/data"

# Get latest sensor reading
curl "http://localhost:5000/api/sensors/66d123456789abcdef123456/latest"
```

### 6. Access the Analytics Dashboard

1. Start your frontend application
2. Navigate to any workspace
3. Click the "Analytics" button in the workspace header
4. View real-time sensor data charts

## Sensor Data Structure

The system generates realistic data for:

### Current Sensor

- **Range**: 0-50 Amperes
- **Pattern**: Sinusoidal with 1-minute cycle + random noise
- **Use Case**: Motor current monitoring

### Vibration Sensor (ADXL345)

- **Range**: -16g to +16g (3 axes: X, Y, Z)
- **Pattern**: Different frequencies for each axis + gravity component
- **Use Case**: Machine vibration analysis

### Temperature Sensors

- **Range**: 20-80°C
- **Pattern**: Daily temperature cycle + random variations
- **Sensors**: Two sensors (A and B) with slight offset
- **Use Case**: Equipment temperature monitoring

## Customization

### Adding New Workspaces

Edit `sensor-data-generator.js` and add workspace IDs to the `workspaceIds` array:

```javascript
const workspaceIds = [
  "your-workspace-id-1",
  "your-workspace-id-2",
  // Add more workspace IDs here
];
```

### Adjusting Data Generation Frequency

Change the interval in `sensor-data-generator.js`:

```javascript
setInterval(() => {
  writeSensorData();
}, 2000); // Change 2000ms to desired interval
```

### Modifying Sensor Patterns

Update the `generateSensorData()` function to customize:

- Value ranges
- Noise levels
- Cyclical patterns
- Sensor types

## Troubleshooting

### InfluxDB Connection Issues

1. Verify Docker container is running:

   ```bash
   docker ps | grep influxdb
   ```

2. Check container logs:

   ```bash
   docker logs maintenance_influxdb
   ```

3. Verify network connectivity:
   ```bash
   curl http://localhost:8086/health
   ```

### Data Generator Issues

1. Check environment variables in `.env`
2. Verify InfluxDB token and organization settings
3. Monitor console output for error messages

### Frontend API Issues

1. Verify backend server is running
2. Check sensor API endpoints are registered
3. Verify authentication middleware

## Production Considerations

### Security

- Change default InfluxDB credentials
- Use secure tokens
- Implement proper authentication
- Configure firewall rules

### Performance

- Adjust data retention policies
- Configure appropriate down-sampling
- Monitor memory and CPU usage
- Set up proper indexing

### Monitoring

- Implement health checks
- Set up alerting for data gaps
- Monitor disk usage for InfluxDB
- Track API response times

## API Endpoints

### Get Sensor Data

```
GET /api/sensors/:workspaceId/data
Query Parameters:
- timeRange: Time range for data (default: 10m)
  Examples: 1h, 30m, 1d, 1w
```

### Get Latest Reading

```
GET /api/sensors/:workspaceId/latest
Returns the most recent sensor reading
```

## Data Visualization

The analytics dashboard provides:

1. **Real-time Status Cards**: Current values for all sensors
2. **Current Chart**: Line chart showing current measurements over time
3. **Vibration Chart**: 3-axis acceleration data from ADXL345
4. **Temperature Chart**: Dual temperature sensor readings
5. **Connection Status**: Real-time connection indicator

Charts auto-refresh every 2 seconds to show live data updates.
