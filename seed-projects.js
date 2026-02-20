/**
 * Seed Projects Script
 * This script adds all the portfolio projects shown in your design to the database
 * Run with: node seed-projects.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Project Schema (simplified for seeding)
const ProjectImageSchema = new mongoose.Schema({
  url: { type: String, required: false },
  alt: { type: String, required: false },
  caption: { type: String },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String },
  thumbnail: ProjectImageSchema,
  technologies: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  sections: {
    hero: {
      enabled: { type: Boolean, default: true },
      title: String,
      tagline: String,
      heroImage: ProjectImageSchema,
      category: String,
    },
    overview: {
      enabled: { type: Boolean, default: true },
      role: String,
      type: { type: String, default: undefined },
      highlights: [String],
      description: String,
      image: ProjectImageSchema,
      client: String,
      timeline: String,
      team: String,
      keyFeatures: [String],
      overviewImage: ProjectImageSchema,
      subsections: [
        {
          title: String,
          content: String,
          image: ProjectImageSchema,
        },
      ],
    },
    problemStatement: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      challenges: [String],
      targetAudience: String,
      images: [ProjectImageSchema],
    },
    solutions: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      solutions: [
        {
          title: String,
          description: String,
          icon: String,
        },
      ],
      images: [ProjectImageSchema],
    },
    branding: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      colorPalette: {
        primary: String,
        secondary: String,
      },
      typography: {
        primary: String,
        secondary: String,
      },
      logo: ProjectImageSchema,
      brandImages: [ProjectImageSchema],
    },
    wireframes: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      wireframes: [ProjectImageSchema],
    },
    uiuxDesign: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      designPrinciples: [String],
      mockups: [ProjectImageSchema],
      designNotes: String,
    },
    developmentProcess: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      methodology: String,
      technicalChallenges: [String],
      codeSnippets: [
        {
          language: String,
          code: String,
          description: String,
        },
      ],
      images: [ProjectImageSchema],
    },
    websitePreview: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      liveUrl: String,
      githubUrl: String,
      screenshots: [ProjectImageSchema],
      videoUrl: String,
    },
    resultsImpact: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      metrics: [
        {
          label: String,
          value: String,
          description: String,
        },
      ],
      testimonials: [
        {
          quote: String,
          author: String,
          role: String,
          avatar: String,
        },
      ],
      images: [ProjectImageSchema],
    },
    conclusion: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      lessonsLearned: [String],
      futureImprovements: [String],
    },
    callToAction: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      primaryButtonText: String,
      primaryButtonLink: String,
      secondaryButtonText: String,
      secondaryButtonLink: String,
    },
    hoverExploration: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      tiles: [
        {
          title: String,
          subtitle: String,
          image: ProjectImageSchema,
        },
      ],
    },
    quoteProcess: {
      enabled: { type: Boolean, default: false },
      quote: String,
      processCards: [
        {
          title: String,
          icon: String,
          items: [String],
        },
      ],
      images: [ProjectImageSchema],
    },
    themes: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      themes: [
        {
          title: String,
          images: [ProjectImageSchema],
        },
      ],
    },
    specialOffers: {
      enabled: { type: Boolean, default: false },
      heading: String,
      description: String,
      offers: [
        {
          title: String,
          subtitle: String,
          description: String,
          originalPrice: String,
          discountedPrice: String,
          discountBadge: String,
          buttonText: String,
          buttonLink: String,
        },
      ],
    },
  },
  sectionOrder: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { strict: false });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

// Projects to seed
const projects = [
  {
    title: "Youssef Ragaee Portfolio",
    slug: "youssef-ragaee-portfolio",
    shortDescription: "A fully functional portfolio website for Waer Ayman, featuring powerful GSAP animations, modern UI/UX design, and a complete admin dashboard for content management.",
    thumbnail: {
      url: "/assets/Frame 129.png",
      alt: "Youssef Ragaee Portfolio Website",
    },
    technologies: ["React", "Tailwind CSS", "GSAP", "MongoDB", "+4"],
    status: "published",
    featured: true,
    order: 0,
    sections: {
      hero: {
        enabled: true,
        title: "Youssef Ragaee Portfolio",
        tagline: "A fully functional portfolio website for Waer Ayman, featuring powerful GSAP animations, modern UI/UX design, and a complete admin dashboard for content management.",
        heroImage: {
          url: "/assets/Frame 129.png",
          alt: "Youssef Ragaee Portfolio Website",
        },
        category: "Personal Portfolio Website",
      },
      overview: {
        enabled: true,
        role: "Full-Stack Developer & Designer",
        type: "Personal Project",
        description: "A fully functional portfolio website featuring powerful GSAP animations, modern UI/UX design, and a complete admin dashboard for content management.",
        highlights: [
          "Modern, responsive design",
          "GSAP animations",
          "Admin dashboard",
          "Content management system"
        ],
      },
    },
  },
  {
    title: "Karim Massaoud Portfolio",
    slug: "karim-massaoud-portfolio",
    shortDescription: "Modern personal portfolio built with Next.js to showcase academic and professional work. Highlight technical expertise and project case studies.",
    thumbnail: {
      url: "/assets/image 4.png",
      alt: "Karim Massaoud Portfolio",
    },
    technologies: ["React", "Next.js", "TypeScript", "GSAP"],
    status: "published",
    featured: true,
    order: 1,
    sections: {
      hero: {
        enabled: true,
        title: "Karim Massaoud Portfolio",
        tagline: "Modern personal portfolio built with Next.js to showcase academic and professional work. Highlight technical expertise and project case studies.",
        heroImage: {
          url: "/assets/image 4.png",
          alt: "Karim Massaoud Portfolio",
        },
        category: "Personal Portfolio Website",
      },
      overview: {
        enabled: true,
        role: "Full-Stack Developer",
        type: "Personal Portfolio",
        description: "Modern personal portfolio built with Next.js to showcase academic and professional work, highlighting technical expertise and project case studies.",
        highlights: [
          "Next.js App Router",
          "MongoDB integration",
          "Dynamic case studies",
          "Admin dashboard"
        ],
      },
    },
  },
  {
    title: "TAW Travel - Tour & Travel Booking Platform",
    slug: "taw-travel-platform",
    shortDescription: "A full-featured travel booking platform that allows users to explore tours, view destinations, and book trips through a modern and intuitive web interface.",
    thumbnail: {
      url: "/assets/special offer.png",
      alt: "TAW Travel Platform",
    },
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "+4"],
    status: "published",
    featured: true,
    order: 2,
    sections: {
      hero: {
        enabled: true,
        title: "Discover Egypt's Wonders",
        tagline: "A full-featured travel booking platform that allows users to explore tours, view destinations, and book trips through a modern and intuitive web interface.",
        heroImage: {
          url: "/assets/special offer.png",
          alt: "TAW Travel Platform",
        },
        category: "Full Stack Web Application",
      },
      overview: {
        enabled: true,
        role: "Full-Stack Developer",
        type: "Web Application",
        description: "A full-featured travel booking platform that allows users to explore tours, view destinations, and book trips through a modern and intuitive web interface.",
        highlights: [
          "Tour exploration and booking",
          "Destination browsing",
          "User authentication",
          "Booking management system"
        ],
      },
    },
  },
  {
    title: "AYMAN Portfolio",
    slug: "ayman-portfolio",
    shortDescription: "A personal portfolio website showcasing skills as a web developer and designer.",
    thumbnail: {
      url: "/assets/Rectangle 61.png",
      alt: "AYMAN Portfolio",
    },
    technologies: ["HTML", "CSS", "JavaScript", "Netlify"],
    status: "published",
    featured: true,
    order: 3,
    sections: {
      hero: {
        enabled: true,
        title: "Portfolio",
        tagline: "A personal portfolio website showcasing skills as a web developer and designer.",
        heroImage: {
          url: "/assets/Rectangle 61.png",
          alt: "AYMAN Portfolio",
        },
        category: "Personal Portfolio Website",
      },
      overview: {
        enabled: true,
        role: "Web Developer & Designer",
        type: "Personal Portfolio",
        description: "A personal portfolio website showcasing skills as a web developer and designer.",
        highlights: [
          "Modern design",
          "Responsive layout",
          "Project showcase",
          "Skills demonstration"
        ],
      },
    },
  },
  {
    title: "Wonder Pearl",
    slug: "wonder-pearl",
    shortDescription: "A web project designed to showcase unique features and design elements under the name 'Wonder Pearl'.",
    thumbnail: {
      url: "/assets/Rectangle 64.png",
      alt: "Wonder Pearl Website",
    },
    technologies: ["HTML", "CSS", "JavaScript", "GSAP Animation", "+1"],
    status: "published",
    featured: true,
    order: 4,
    sections: {
      hero: {
        enabled: true,
        title: "Wonder Pearl",
        tagline: "A web project designed to showcase unique features and design elements under the name 'Wonder Pearl'.",
        heroImage: {
          url: "/assets/Rectangle 64.png",
          alt: "Wonder Pearl Website",
        },
        category: "Web Application / Landing Page",
      },
      overview: {
        enabled: true,
        role: "Frontend Developer",
        type: "Landing Page",
        description: "A web project designed to showcase unique features and design elements under the name 'Wonder Pearl'.",
        highlights: [
          "GSAP animations",
          "Modern UI design",
          "Interactive elements",
          "Responsive layout"
        ],
      },
    },
  },
];

async function seedProjects() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing projects (optional - comment out if you want to keep existing)
    // console.log('Clearing existing projects...');
    // await Project.deleteMany({});
    // console.log('✅ Existing projects cleared\n');

    // Insert projects
    console.log('Adding projects...\n');
    for (const project of projects) {
      try {
        // Check if project already exists
        const existing = await Project.findOne({ slug: project.slug });
        if (existing) {
          console.log(`⚠️  Project "${project.title}" already exists (slug: ${project.slug})`);
          
          // Update existing project
          await Project.findOneAndUpdate(
            { slug: project.slug },
            { ...project, updatedAt: new Date() },
            { new: true }
          );
          console.log(`✅ Updated: ${project.title}\n`);
        } else {
          // Create new project
          const newProject = new Project(project);
          await newProject.save();
          console.log(`✅ Created: ${project.title}`);
          console.log(`   Slug: ${project.slug}`);
          console.log(`   Category: ${project.sections.hero.category}`);
          console.log(`   Technologies: ${project.technologies.join(', ')}\n`);
        }
      } catch (error) {
        console.error(`❌ Error adding "${project.title}":`, error.message);
      }
    }

    console.log('\n🎉 Project seeding completed!');
    console.log(`\nTotal projects in database: ${await Project.countDocuments()}`);
    
    // Display all projects
    const allProjects = await Project.find().select('title slug status category');
    console.log('\n📋 All Projects:');
    allProjects.forEach((p, i) => {
      console.log(`${i + 1}. ${p.title} (${p.status})`);
    });

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the seed function
seedProjects();
