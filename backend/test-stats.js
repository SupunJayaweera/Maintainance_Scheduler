// Test script to check workspace stats endpoint
import fetch from "node-fetch";

const testWorkspaceStats = async () => {
  try {
    // You'll need to replace these with actual values from your database
    const workspaceId = "your-workspace-id"; // Replace with actual workspace ID
    const authToken = "your-auth-token"; // Replace with actual JWT token

    const response = await fetch(
      `http://localhost:5000/api/workspaces/${workspaceId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(
        "TaskTrendsData:",
        JSON.stringify(data.taskTrendsData, null, 2)
      );
    } else {
      console.log("Error:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Uncomment and run with actual workspace ID and token
// testWorkspaceStats();

console.log("To test the stats endpoint:");
console.log("1. Get a workspace ID from your database");
console.log(
  "2. Get a valid JWT token (from browser dev tools or login response)"
);
console.log("3. Replace the values in this script and run it");
