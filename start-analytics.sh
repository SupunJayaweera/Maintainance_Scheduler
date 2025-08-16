#!/bin/bash

echo "🚀 Starting Maintenance Scheduler with Real-time Analytics"
echo "========================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is running"

# Start InfluxDB
echo "📊 Starting InfluxDB..."
docker-compose -f docker-compose.influxdb.yml up -d

# Wait for InfluxDB to be ready
echo "⏳ Waiting for InfluxDB to be ready..."
sleep 10

# Check if InfluxDB is responding
if curl -f http://localhost:8086/health > /dev/null 2>&1; then
    echo "✅ InfluxDB is ready at http://localhost:8086"
else
    echo "❌ InfluxDB is not responding. Check logs with: docker logs maintenance_influxdb"
    exit 1
fi

echo ""
echo "🎯 Setup Complete! You can now:"
echo "1. Start the backend server: cd backend && npm start"
echo "2. Start the sensor data generator: cd backend && npm run sensor-generator"
echo "3. Start the frontend: cd frontend && npm run dev"
echo ""
echo "📱 Access URLs:"
echo "- InfluxDB UI: http://localhost:8086 (admin/adminpassword)"
echo "- Chronograf UI: http://localhost:8888"
echo "- Frontend: http://localhost:5173"
echo ""
echo "📋 To view real-time analytics:"
echo "1. Open the frontend application"
echo "2. Navigate to any workspace"  
echo "3. Click the 'Analytics' button"
echo ""
echo "🛑 To stop everything: docker-compose -f docker-compose.influxdb.yml down"
