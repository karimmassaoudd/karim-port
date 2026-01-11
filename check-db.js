// Quick database check script
// Run this to see what's actually in MongoDB

import dbConnect from "./src/lib/mongodb.js";
import Project from "./src/models/Project.js";

async function checkOverviewData() {
  await dbConnect();
  
  // Find the project by ID (replace with your project ID)
  const projectId = "6962fc69af7c2955a777ab62"; // From your server logs
  
  const project = await Project.findById(projectId).lean();
  
  console.log("=== PROJECT OVERVIEW DATA ===");
  console.log(JSON.stringify(project.sections?.overview, null, 2));
  
  process.exit(0);
}

checkOverviewData();
