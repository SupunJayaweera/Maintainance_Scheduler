# Industrial Sensor Notification System

## Overview

The Industrial Sensor Notification System provides real-time alerts when sensor readings exceed predefined safety thresholds. This system is designed for industrial maintenance applications where monitoring critical parameters like current, vibration, and temperature is essential for safety and equipment health.

## Features

### 🔔 Real-time Notifications

- **Bell Icon**: Located in the analytics dashboard header
- **Badge Counter**: Shows unread notification count
- **Auto-refresh**: Monitors sensor data every 10 seconds for threshold violations

### 🚨 Safety Thresholds

- **Current Sensor**: > 3.5 Amperes (Critical)
- **Vibration Magnitude**: > 12.0g (Warning) - Resultant of X, Y, Z axes
- **Temperature Sensor A**: > 45.0°C (Warning)
- **Temperature Sensor B**: > 45.0°C (Warning)
- **Offline Detection**: Sensors offline for more than 1 minute (Warning)

### 📊 Notification Categories

- **Critical**: High current (>3.5A) - Red indicators
- **Warning**: High vibration magnitude (>12g), temperature (>45°C), offline sensors - Yellow indicators
- **Info**: General system notifications - Blue indicators

## Implementation Details

### Core Components

#### 1. `use-notifications.ts` Hook

```typescript
// Key features:
- Real-time threshold monitoring
- Vibration magnitude calculation using 3-axis ADXL345 data
- Automatic notification generation and management
- Duplicate prevention
- Notification persistence in local state
```

#### 2. `NotificationDropdown` Component

```typescript
// Features:
- Professional bell icon with badge
- Dropdown with notification list
- Click-to-mark-as-read functionality
- Time ago formatting
- Color-coded notification types
- Clear all functionality
```

#### 3. `NotificationBell` Component

```typescript
// Integration:
- Workspace-specific notifications
- React Router integration
- Automatic workspace ID detection
```

### Threshold Calculations

#### Current Monitoring

```javascript
if (latestSensorData.current > 3.5) {
  // Generate critical notification
  // Current readings above 3.5A indicate potential overload
}
```

#### Vibration Analysis (ADXL345 Accelerometer)

```javascript
// Calculate resultant magnitude from 3 axes
const vibrationMagnitude = Math.sqrt(
  latestSensorData.vibrationX ** 2 +
    latestSensorData.vibrationY ** 2 +
    latestSensorData.vibrationZ ** 2
);

if (vibrationMagnitude > 12.0) {
  // Generate warning notification
  // High vibration magnitude indicates mechanical issues
}
```

#### Temperature Monitoring

```javascript
// Dual sensor monitoring
if (latestSensorData.temperatureA > 45.0) {
  // Generate warning notification for sensor A
  // High temperature indicates overheating
}

if (latestSensorData.temperatureB > 45.0) {
  // Generate warning notification for sensor B
  // High temperature indicates overheating
}
```

#### Offline Detection

```javascript
if (latestSensorData.status === "offline") {
  // Generate warning notification
  // Sensors offline for >1 minute
}
```

## User Interface

### Bell Icon Features

- **Visual Badge**: Red circle with unread count (max display: 9+)
- **Hover States**: Interactive feedback
- **Click Outside**: Closes dropdown automatically

### Notification Dropdown

- **Header**: Shows total unread count and workspace context
- **Notification Items**:
  - Icon based on category (⚡ current, ⚠️ vibration, 🌡️ temperature, 📶 offline)
  - Color-coded left border (red=critical, yellow=warning, blue=info)
  - Timestamp with "time ago" formatting
  - Value vs threshold comparison
  - Read/unread status indicator
- **Actions**: Mark as read, clear all

### Notification States

- **Unread**: Bold text, colored background, blue dot indicator
- **Read**: Lighter text, semi-transparent background
- **Critical**: Red border and background tint
- **Warning**: Yellow border and background tint

## Integration Points

### Analytics Dashboard

```tsx
// Added to workspace-analytics.tsx header
<NotificationBell workspaceName="Analytics Workspace" />
```

### Real-time Data Flow

1. **Sensor Data**: InfluxDB → Backend API → React Query
2. **Threshold Check**: useNotifications hook monitors latest data
3. **Alert Generation**: Automatic notification creation
4. **UI Update**: Bell icon badge updates, dropdown populates
5. **User Interaction**: Click to view, mark as read, clear all

## Testing Features

### Simulated Threshold Violations

The sensor data generator includes 5% random chance of creating threshold violations:

- **Current Spikes**: Above 20A
- **Vibration Spikes**: Above 1.5g magnitude
- **Temperature Spikes**: Above 60°C

### Manual Testing

1. Navigate to workspace analytics
2. Wait for threshold violations (5% chance every 2 seconds)
3. Observe bell icon badge increment
4. Click bell to view notifications
5. Test mark as read and clear all functionality

## Safety Considerations

### Industrial Thresholds

- **Current (20A)**: Based on typical industrial motor overload protection
- **Vibration (1.5g)**: Standard threshold for machinery condition monitoring
- **Temperature (60°C)**: Common overheating threshold for electrical equipment

### Alert Prioritization

- **Critical (Current)**: Immediate attention required - potential electrical hazard
- **Warning (Vibration/Temperature)**: Monitor closely - preventive maintenance needed
- **Info (Offline)**: Communication issue - verify sensor connectivity

## Future Enhancements

### Planned Features

- [ ] Email/SMS notifications for critical alerts
- [ ] Notification history persistence
- [ ] Custom threshold configuration per workspace
- [ ] Notification sound alerts
- [ ] Alert escalation rules
- [ ] Integration with maintenance scheduling

### Advanced Monitoring

- [ ] Trend analysis for predictive alerts
- [ ] Multi-sensor correlation alerts
- [ ] Historical threshold breach reports
- [ ] Machine learning anomaly detection

## Troubleshooting

### Common Issues

1. **No Notifications**: Check sensor data generator is running
2. **Bell Not Appearing**: Verify workspaceId parameter exists
3. **Threshold Not Triggering**: Confirm sensor values exceed limits
4. **Dropdown Not Opening**: Check for JavaScript errors in console

### Debug Information

- Sensor thresholds logged in console
- Notification generation events tracked
- React Query cache status visible in DevTools

## Architecture Notes

### Performance Optimization

- **Debounced Updates**: Prevents notification spam
- **Duplicate Prevention**: Checks existing notifications
- **Memory Management**: Automatic cleanup of old notifications
- **Efficient Rendering**: React.memo for dropdown components

### Type Safety

- Full TypeScript implementation
- Strict type checking for sensor data
- Interface definitions for all notification types
- Type-safe React Query integration

This notification system provides a robust foundation for industrial IoT monitoring with real-time alerting capabilities and professional user experience.
