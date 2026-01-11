import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

// Helper function to clean and migrate project data
function cleanProjectData(project: Record<string, unknown>) {
  // Migrate colorPalette from array to object
  if ((project as any).sections?.branding?.colorPalette) {
    if (Array.isArray((project as any).sections.branding.colorPalette)) {
      (project as any).sections.branding.colorPalette = { primary: "", secondary: "" };
    } else if (typeof (project as any).sections.branding.colorPalette !== "object") {
      (project as any).sections.branding.colorPalette = { primary: "", secondary: "" };
    } else {
      // Ensure primary and secondary exist
      if (!(project as any).sections.branding.colorPalette.primary) {
        (project as any).sections.branding.colorPalette.primary = "";
      }
      if (!(project as any).sections.branding.colorPalette.secondary) {
        (project as any).sections.branding.colorPalette.secondary = "";
      }
    }
  }

  // Ensure heroImage exists
  if (!(project as any).sections?.hero?.heroImage) {
    if (!(project as any).sections) (project as any).sections = {};
    if (!(project as any).sections.hero) (project as any).sections.hero = {};
    (project as any).sections.hero.heroImage = { url: "", alt: "", caption: "" };
  }

  // Ensure logo exists
  if (!(project as any).sections?.branding?.logo) {
    if (!(project as any).sections) (project as any).sections = {};
    if (!(project as any).sections.branding) (project as any).sections.branding = {};
    (project as any).sections.branding.logo = { url: "", alt: "", caption: "" };
  }

  return project;
}

// GET all projects or single project by ID
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const status = searchParams.get("status"); // 'draft' | 'published' | 'all'

    // Get single project by ID
    if (id) {
      const project = await Project.findById(id);
      if (!project) {
        return NextResponse.json(
          { success: false, error: "Project not found" },
          { status: 404 },
        );
      }

      // Debug: Log raw overview data from DB
      console.log("Raw DB overview data:", JSON.stringify((project as any).sections?.overview, null, 2));

      // Clean and migrate data
      const cleanedProject = cleanProjectData(project.toObject());

      // Debug: Log after cleaning
      console.log("After cleaning overview data:", JSON.stringify((cleanedProject as any).sections?.overview, null, 2));

      return NextResponse.json({ success: true, data: cleanedProject });
    }

    // Get single project by slug
    if (slug) {
      const project = await Project.findOne({ slug });
      if (!project) {
        return NextResponse.json(
          { success: false, error: "Project not found" },
          { status: 404 },
        );
      }

      // Clean and migrate data
      const cleanedProject = cleanProjectData(project.toObject());

      return NextResponse.json({ success: true, data: cleanedProject });
    }

    // Get all projects
    const filter: Record<string, unknown> = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const projects = await Project.find(filter).sort({
      order: 1,
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.shortDescription) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 },
      );
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // Check if slug already exists
    const existingProject = await Project.findOne({ slug: body.slug });
    if (existingProject) {
      return NextResponse.json(
        { success: false, error: "A project with this slug already exists" },
        { status: 400 },
      );
    }

    // Create default sections structure if not provided
    if (!body.sections) {
      body.sections = {
        hero: {
          enabled: true,
          title: body.title,
          tagline: body.shortDescription,
          heroImage: body.thumbnail || { url: "", alt: "" },
          category: "Web Development",
        },
        overview: {
          enabled: true,
          description: body.shortDescription,
          keyFeatures: [],
        },
        problemStatement: { enabled: false },
        solutions: { enabled: false },
        branding: { enabled: false },
        wireframes: { enabled: false },
        uiuxDesign: { enabled: false },
        developmentProcess: { enabled: false },
        websitePreview: { enabled: false },
        resultsImpact: { enabled: false },
        conclusion: { enabled: false },
        callToAction: { enabled: false },
      };
    }

    // Clean up empty image objects before saving
    if (body.thumbnail && (!body.thumbnail.url || body.thumbnail.url === "")) {
      delete body.thumbnail;
    }

    if (
      body.sections?.hero?.heroImage &&
      (!body.sections.hero.heroImage.url ||
        body.sections.hero.heroImage.url === "")
    ) {
      delete body.sections.hero.heroImage;
    }

    if (
      body.sections?.branding?.logo &&
      (!body.sections.branding.logo.url ||
        body.sections.branding.logo.url === "")
    ) {
      delete body.sections.branding.logo;
    }

    // Clean up empty description
    if (body.sections?.overview?.description === "") {
      body.sections.overview.description = undefined;
    }

    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST project error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create project",
      },
      { status: 500 },
    );
  }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 },
      );
    }

    // If slug is being updated, check for duplicates
    if (updateData.slug) {
      const existingProject = await Project.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (existingProject) {
        return NextResponse.json(
          { success: false, error: "A project with this slug already exists" },
          { status: 400 },
        );
      }
    }

    // Clean up empty image objects before updating
    if (
      updateData.thumbnail &&
      (!updateData.thumbnail.url || updateData.thumbnail.url === "")
    ) {
      delete updateData.thumbnail;
    }

    if (
      updateData.sections?.hero?.heroImage &&
      (!updateData.sections.hero.heroImage.url ||
        updateData.sections.hero.heroImage.url === "")
    ) {
      delete updateData.sections.hero.heroImage;
    }

    if (
      updateData.sections?.branding?.logo &&
      (!updateData.sections.branding.logo.url ||
        updateData.sections.branding.logo.url === "")
    ) {
      delete updateData.sections.branding.logo;
    }

    // Clean up empty description
    if (updateData.sections?.overview?.description === "") {
      updateData.sections.overview.description = undefined;
    }

    // Debug logging for overview section
    console.log("Saving overview section:", JSON.stringify(updateData.sections?.overview, null, 2));

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error: unknown) {
    console.error("PUT project error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update project",
      },
      { status: 500 },
    );
  }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 },
      );
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("DELETE project error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
