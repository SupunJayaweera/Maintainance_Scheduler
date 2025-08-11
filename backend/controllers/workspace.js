import jwt from "jsonwebtoken";
import Project from "../models/project.js";
import User from "../models/user.js";
import WorkspaceInvite from "../models/workspace-invite.js";
import Workspace from "../models/workspace.js";
import recordActivity from "../libs/index.js";
import { sendEmail } from "../libs/send-email.js";

const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner", joinedAt: new Date() }],
    });
    res.status(201).json(workspace);
  } catch (error) {
    console.log("Error creating workspace:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
      $or: [
        { isArchived: { $ne: true } }, // Not archived
        { isArchived: { $exists: false } }, // Field doesn't exist (legacy workspaces)
      ],
    }).sort({ createdAt: -1 });

    // Return empty array if no workspaces found (normal for new users)
    res.status(200).json(workspaces || []);
  } catch (error) {
    console.log("Error fetching workspaces:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId).populate(
      "members.user",
      "name email profilePicture"
    );

    if (!workspace) {
      console.log("Workspace not found or user not a member");
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.log("Error fetching workspace:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // First get the workspace
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Then get the projects for this workspace
    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
      // members: { $in: [req.user._id] },
    })
      // .populate("tasks", "status")
      .sort({ createdAt: -1 });

    // Return both workspace and projects in the requested format
    res.status(200).json({
      workspace,
      projects,
    });
  } catch (error) {
    console.log("Error fetching workspace projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const [totalProjects, projects] = await Promise.all([
      Project.countDocuments({ workspace: workspaceId }),
      Project.find({ workspace: workspaceId })
        .populate({
          path: "tasks",
          select:
            "title status dueDate project updatedAt createdAt isArchived priority",
        })
        .sort({ createdAt: -1 }),
    ]);

    console.log("Projects found:", projects.length);
    console.log("First project tasks:", projects[0]?.tasks?.length || 0);
    if (projects[0]?.tasks?.length > 0) {
      console.log("Sample task:", projects[0].tasks[0]);
    }

    const totalTasks = projects.reduce((acc, project) => {
      return acc + project.tasks.length;
    }, 0);

    const totalProjectInProgress = projects.filter(
      (project) => project.status === "In Progress"
    ).length;
    // const totalProjectCompleted = projects.filter(
    //   (project) => project.status === "Completed"
    // ).length;

    const totalTaskCompleted = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "Done").length
      );
    }, 0);

    const totalTaskToDo = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "To Do").length
      );
    }, 0);

    const totalTaskInProgress = projects.reduce((acc, project) => {
      return (
        acc +
        project.tasks.filter((task) => task.status === "In Progress").length
      );
    }, 0);

    const tasks = projects.flatMap((project) => project.tasks || []);

    console.log("Total tasks found:", tasks.length);
    if (tasks.length > 0) {
      console.log(
        "Sample tasks:",
        tasks.slice(0, 3).map((t) => ({
          title: t.title,
          status: t.status,
          createdAt: t.createdAt,
          project: t.project,
        }))
      );
    }

    // get upcoming task in next 7 days

    const upcomingTasks = tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      return (
        taskDate > today &&
        taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });

    // Use last 30 days for chart display to capture your existing data
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    // Initialize chart data based on actual last 30 days
    const taskTrendsData = last30Days.map((date) => ({
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toDateString(),
      completed: 0,
      inProgress: 0,
      toDo: 0,
    }));

    console.log(
      "Last 30 days range:",
      last30Days[0].toDateString(),
      "to",
      last30Days[29].toDateString()
    );
    console.log("Initial taskTrendsData length:", taskTrendsData.length);

    // populate task trends data - check against all tasks from last 30 days
    for (const project of projects) {
      console.log(
        `Project: ${project.title}, Tasks: ${project.tasks?.length || 0}`
      );

      for (const task of project.tasks || []) {
        const taskDate = new Date(task.createdAt);
        console.log(
          `Task: ${task.title}, Created: ${taskDate.toDateString()}, Status: ${
            task.status
          }`
        );

        // Check if task was created in the last 30 days
        const dayIndex = last30Days.findIndex((date) => {
          const isSameDay =
            date.getDate() === taskDate.getDate() &&
            date.getMonth() === taskDate.getMonth() &&
            date.getFullYear() === taskDate.getFullYear();
          return isSameDay;
        });

        console.log(`Task ${task.title} dayIndex: ${dayIndex}`);

        if (dayIndex !== -1) {
          switch (task.status) {
            case "Done":
              taskTrendsData[dayIndex].completed++;
              console.log(
                `Added completed task to day ${dayIndex} (${taskTrendsData[dayIndex].date})`
              );
              break;
            case "In Progress":
              taskTrendsData[dayIndex].inProgress++;
              console.log(
                `Added in progress task to day ${dayIndex} (${taskTrendsData[dayIndex].date})`
              );
              break;
            case "To Do":
              taskTrendsData[dayIndex].toDo++;
              console.log(
                `Added todo task to day ${dayIndex} (${taskTrendsData[dayIndex].date})`
              );
              break;
          }
        }
      }
    }

    // For chart display, group by week and sum the data
    const today = new Date();
    const weeklyData = [
      {
        name: "Week 1 (Latest)",
        period: `${last30Days[21].toLocaleDateString()} - ${last30Days[27].toLocaleDateString()}`,
        completed: 0,
        inProgress: 0,
        toDo: 0,
      },
      {
        name: "Week 2",
        period: `${last30Days[14].toLocaleDateString()} - ${last30Days[20].toLocaleDateString()}`,
        completed: 0,
        inProgress: 0,
        toDo: 0,
      },
      {
        name: "Week 3",
        period: `${last30Days[7].toLocaleDateString()} - ${last30Days[13].toLocaleDateString()}`,
        completed: 0,
        inProgress: 0,
        toDo: 0,
      },
      {
        name: "Week 4 (Oldest)",
        period: `${last30Days[0].toLocaleDateString()} - ${last30Days[6].toLocaleDateString()}`,
        completed: 0,
        inProgress: 0,
        toDo: 0,
      },
    ];

    // Group the 30 days into 4 weeks
    taskTrendsData.forEach((day, index) => {
      const weekIndex = Math.floor(index / 7);
      if (weekIndex < 4) {
        weeklyData[weekIndex].completed += day.completed;
        weeklyData[weekIndex].inProgress += day.inProgress;
        weeklyData[weekIndex].toDo += day.toDo;
      }
    });

    console.log("Final weeklyData:", JSON.stringify(weeklyData, null, 2));

    // get project status distribution
    const projectStatusData = [
      { name: "Completed", value: 0, color: "#10b981" },
      { name: "In Progress", value: 0, color: "#3b82f6" },
      { name: "Planning", value: 0, color: "#f59e0b" },
    ];

    for (const project of projects) {
      switch (project.status) {
        case "Completed":
          projectStatusData[0].value++;
          break;
        case "In Progress":
          projectStatusData[1].value++;
          break;
        case "Planning":
          projectStatusData[2].value++;
          break;
      }
    }

    // Task priority distribution
    const taskPriorityData = [
      { name: "High", value: 0, color: "#ef4444" },
      { name: "Medium", value: 0, color: "#f59e0b" },
      { name: "Low", value: 0, color: "#6b7280" },
    ];

    for (const task of tasks) {
      switch (task.priority) {
        case "High":
          taskPriorityData[0].value++;
          break;
        case "Medium":
          taskPriorityData[1].value++;
          break;
        case "Low":
          taskPriorityData[2].value++;
          break;
      }
    }

    const workspaceProductivityData = [];

    for (const project of projects) {
      const projectTask = tasks.filter(
        (task) => task.project.toString() === project._id.toString()
      );

      const completedTask = projectTask.filter(
        (task) => task.status === "Done" && task.isArchived === false
      );

      workspaceProductivityData.push({
        name: project.title,
        completed: completedTask.length,
        total: projectTask.length,
      });
    }

    const stats = {
      totalProjects,
      totalTasks,
      totalProjectInProgress,
      totalTaskCompleted,
      totalTaskToDo,
      totalTaskInProgress,
    };

    res.status(200).json({
      stats,
      taskTrendsData: weeklyData, // Use weekly data instead of daily
      projectStatusData,
      taskPriorityData,
      workspaceProductivityData,
      upcomingTasks,
      recentProjects: projects.slice(0, 5),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const inviteUserToWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const userMemberInfo = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!userMemberInfo || !["admin", "owner"].includes(userMemberInfo.role)) {
      return res.status(403).json({
        message: "You are not authorized to invite members to this workspace",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === existingUser._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "User already a member of this workspace",
      });
    }

    const isInvited = await WorkspaceInvite.findOne({
      user: existingUser._id,
      workspaceId: workspaceId,
    });

    if (isInvited && isInvited.expiresAt > new Date()) {
      return res.status(400).json({
        message: "User already invited to this workspace",
      });
    }

    if (isInvited && isInvited.expiresAt < new Date()) {
      await WorkspaceInvite.deleteOne({ _id: isInvited._id });
    }

    const inviteToken = jwt.sign(
      {
        user: existingUser._id,
        workspaceId: workspaceId,
        role: role || "member",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await WorkspaceInvite.create({
      user: existingUser._id,
      workspaceId: workspaceId,
      token: inviteToken,
      role: role || "member",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const invitationLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspace._id}?tk=${inviteToken}`;

    const emailContent = `
      <p>You have been invited to join ${workspace.name} workspace</p>
      <p>Click here to join: <a href="${invitationLink}">${invitationLink}</a></p>
    `;

    await sendEmail(
      email,
      "You have been invited to join a workspace",
      emailContent
    );

    res.status(200).json({
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const acceptGenerateInvite = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "You are already a member of this workspace",
      });
    }

    workspace.members.push({
      user: req.user._id,
      role: "member",
      joinedAt: new Date(),
    });

    await workspace.save();

    await recordActivity(
      req.user._id,
      "joined_workspace",
      "Workspace",
      workspaceId,
      {
        description: `Joined ${workspace.name} workspace`,
      }
    );

    res.status(200).json({
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const acceptInviteByToken = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { user, workspaceId, role } = decoded;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === user.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "User already a member of this workspace",
      });
    }

    const inviteInfo = await WorkspaceInvite.findOne({
      user: user,
      workspaceId: workspaceId,
    });

    if (!inviteInfo) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    if (inviteInfo.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Invitation has expired",
      });
    }

    workspace.members.push({
      user: user,
      role: role || "member",
      joinedAt: new Date(),
    });

    await workspace.save();

    await Promise.all([
      WorkspaceInvite.deleteOne({ _id: inviteInfo._id }),
      recordActivity(user, "joined_workspace", "Workspace", workspaceId, {
        description: `Joined ${workspace.name} workspace`,
      }),
    ]);

    res.status(200).json({
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const archiveWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // Check if user is owner or admin
    const userMember = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!userMember || !["owner", "admin"].includes(userMember.role)) {
      return res.status(403).json({
        message: "You don't have permission to archive this workspace",
      });
    }

    workspace.isArchived = !workspace.isArchived;
    await workspace.save();

    // Record activity
    await recordActivity(
      req.user._id,
      workspace.isArchived ? "archived_workspace" : "unarchived_workspace",
      "Workspace",
      workspaceId,
      {
        description: `${
          workspace.isArchived ? "Archived" : "Unarchived"
        } workspace ${workspace.name}`,
      }
    );

    res.status(200).json({
      message: `Workspace ${
        workspace.isArchived ? "archived" : "unarchived"
      } successfully`,
      workspace,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getArchivedWorkspaces = async (req, res) => {
  try {
    const archivedWorkspaces = await Workspace.find({
      "members.user": req.user._id,
      isArchived: true,
    }).sort({ updatedAt: -1 });

    res.status(200).json(archivedWorkspaces);
  } catch (error) {
    console.log("Error fetching archived workspaces:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
  inviteUserToWorkspace,
  acceptGenerateInvite,
  acceptInviteByToken,
  archiveWorkspace,
  getArchivedWorkspaces,
};
