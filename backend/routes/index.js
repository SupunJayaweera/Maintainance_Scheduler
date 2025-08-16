import express from "express";

import authRoutes from "./auth.js";
import workspaceRoutes from "./workspace.js";
import projectRoutes from "./projects.js";
import taskRoutes from "./task.js";
import userRoutes from "./user.js";
import sensorRoutes from "./sensor.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/user", userRoutes);
router.use("/sensors", sensorRoutes);

export default router;
