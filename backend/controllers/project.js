import Project from "../models/project.js";
import Task from "../models/task.js";
import Workspace from "../models/workspace.js";
import recordActivity from "../libs/index.js";

const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Forbidden: you are not a member of this workspace" });
    }

    const tagArray = tags ? tags.split(",") : [];

    const newProject = await Project.create({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagArray,
      workspace: workspaceId,
      members,
      createdBy: req.user._id,
    });

    workspace.projects.push(newProject._id);
    await workspace.save();

    res.status(201).json(newProject);
  } catch (error) {
    console.log("Error creating project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate("members.user");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const tasks = await Task.find({
      project: projectId,
      isArchived: false,
    })
      .populate("assignees", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      project,
      tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const archiveProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is a member of the project with appropriate permissions
    const userMember = project.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!userMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    // Only project managers or workspace owners/admins can archive projects
    const workspace = await Workspace.findById(project.workspace);
    const workspaceMember = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    const canArchive =
      userMember.role === "manager" ||
      workspaceMember?.role === "owner" ||
      workspaceMember?.role === "admin";

    if (!canArchive) {
      return res.status(403).json({
        message: "You don't have permission to archive this project",
      });
    }

    // Toggle archive status
    project.isArchived = !project.isArchived;
    await project.save();

    // Record activity
    await recordActivity(
      req.user._id,
      project.isArchived ? "archive_project" : "unarchive_project",
      `${project.isArchived ? "Archived" : "Unarchived"} project "${
        project.title
      }"`,
      project.workspace
    );

    res.status(200).json({
      message: `Project ${
        project.isArchived ? "archived" : "unarchived"
      } successfully`,
      project,
    });
  } catch (error) {
    console.log("Error archiving project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getArchivedProjects = async (req, res) => {
  try {
    // Get all workspaces where user is a member
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    });

    const workspaceIds = workspaces.map((ws) => ws._id);

    // Find archived projects from user's workspaces
    const archivedProjects = await Project.find({
      workspace: { $in: workspaceIds },
      isArchived: true,
    })
      .populate("workspace", "name color")
      .populate("members.user", "name email profilePicture")
      .sort({ updatedAt: -1 });

    res.status(200).json(archivedProjects);
  } catch (error) {
    console.log("Error fetching archived projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = [
      "Planning",
      "In Progress",
      "On Hold",
      "Completed",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user is a member of the project
    const userMember = project.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!userMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    // Only project managers or workspace owners/admins can change project status
    const workspace = await Workspace.findById(project.workspace);
    const workspaceMember = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    const canUpdateStatus =
      userMember.role === "manager" ||
      workspaceMember?.role === "owner" ||
      workspaceMember?.role === "admin";

    if (!canUpdateStatus) {
      return res.status(403).json({
        message: "You don't have permission to update this project status",
      });
    }

    // Update project status
    project.status = status;
    await project.save();

    // Log activity (optional - you can add this if you have activity logging)
    // await recordActivity({
    //   user: req.user._id,
    //   action: "project_status_updated",
    //   target: "Project",
    //   targetId: project._id,
    //   details: { oldStatus: project.status, newStatus: status },
    // });

    res.status(200).json({
      message: "Project status updated successfully",
      project: {
        _id: project._id,
        status: project.status,
      },
    });
  } catch (error) {
    console.log("Error updating project status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createProject,
  getProjectDetails,
  getProjectTasks,
  archiveProject,
  getArchivedProjects,
  updateProjectStatus,
};
