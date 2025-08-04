import express from "express";

import authRoutes from "./auth.js";
import workspaceRoutes from "./workspace.js";
import projectRoutes from "./projects.js";
import taskRoutes from "./task.js";
import userRoutes from "./user.js";
import influxRoutes from "./influx.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/user", userRoutes);
router.use("/influx", influxRoutes);

export default router;


