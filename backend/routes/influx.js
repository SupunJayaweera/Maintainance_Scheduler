import express from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { getTaskStatusData } from "../controllers/influx-controller.js";

const router = express.Router();

router.get(
  "/workspace/:workspaceId/task-status-data",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
  }),
  getTaskStatusData
);

export default router;

