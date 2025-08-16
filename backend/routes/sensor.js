import express from "express";
import {
  getSensorData,
  getLatestSensorReading,
} from "../controllers/sensor.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

// Get sensor data for a workspace
router.get("/:workspaceId/data", authMiddleware, getSensorData);

// Get latest sensor reading for a workspace
router.get("/:workspaceId/latest", authMiddleware, getLatestSensorReading);

export default router;
