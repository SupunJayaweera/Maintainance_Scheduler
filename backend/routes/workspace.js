import express from "express";
import {
  inviteMemberSchema,
  tokenSchema,
  workspaceSchema,
} from "../libs/validate-schema.js";
import { validateRequest } from "zod-express-middleware";
import { authMiddleware } from "../middleware/auth-middleware.js";
import {
  acceptGenerateInvite,
  acceptInviteByToken,
  archiveWorkspace,
  createWorkspace,
  getArchivedWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
} from "../controllers/workspace.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/archived", authMiddleware, getArchivedWorkspaces);

router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({ body: tokenSchema }),
  acceptInviteByToken
);

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteUserToWorkspace
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
  }),
  acceptGenerateInvite
);

router.put(
  "/:workspaceId/archive",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
  }),
  archiveWorkspace
);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);

router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);

router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);

export default router;
