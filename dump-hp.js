const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const HomePage =
    mongoose.models.HomePage ||
    mongoose.model(
      "HomePage",
      new mongoose.Schema({}, { strict: false, collection: "homepages" }),
    );
  const Project =
    mongoose.models.Project ||
    mongoose.model(
      "Project",
      new mongoose.Schema({}, { strict: false, collection: "projects" }),
    );

  // show what's in homepage
  const hp = await HomePage.findOne();
  console.log(
    "HomePage featured:",
    JSON.stringify(hp.featuredProjects, null, 2),
  );

  process.exit(0);
});
