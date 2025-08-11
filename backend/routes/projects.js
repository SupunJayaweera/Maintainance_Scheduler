import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import { projectSchema } from "../libs/validate-schema.js";
import {
  createProject,
  getProjectDetails,
  getProjectTasks,
  archiveProject,
  getArchivedProjects,
} from "../controllers/project.js";
import { z } from "zod";

const router = express.Router();

router.get("/archived", authMiddleware, getArchivedProjects);

router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: projectSchema,
  }),
  createProject
);

router.get(
  "/:projectId",
  authMiddleware,
  validateRequest({
    params: z.object({ projectId: z.string() }),
  }),
  getProjectDetails
);

router.get(
  "/:projectId/tasks",
  authMiddleware,
  validateRequest({ params: z.object({ projectId: z.string() }) }),
  getProjectTasks
);

router.put(
  "/:projectId/archive",
  authMiddleware,
  validateRequest({
    params: z.object({ projectId: z.string() }),
  }),
  archiveProject
);

export default router;
