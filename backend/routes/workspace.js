import express from "express";
import { workspaceSchema } from "../libs/validate-schema.js";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "../middleware/auth-middleware.js";
import {
  createWorkspace,
  getWorkspaceById,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
} from "../controllers/workspace.js";
import { get } from "mongoose";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceById);

router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);

router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);

export default router;
