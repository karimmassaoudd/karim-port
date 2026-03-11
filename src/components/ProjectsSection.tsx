"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEffect, useLayoutEffect, useState } from "react";

// --- Types ---
type Project = {
  _id: string;
  title: string;
  slug: string;
  sections?: {
    hero?: {
      heroImage?: {
        url?: string;
      };
    };
    overview?: {
      tagline?: string;
      category?: string;
    };
    [key: string]: any;
  };
  technologies?: string[];
  liveUrl?: string;
};

type ProjectReference = {
  projectId: Project;
  order: number;
  isVisible: boolean;
};

// Fallback projects if database is empty
const fallbackProjects: Project[] = [
  {
    _id: "fallback-1",
    title: "Travel World",
    slug: "travel-world",
    sections: {
      hero: {
        heroImage: {
          url: "/assets/Travel world Fourth Picture .png",
        },
      },
      overview: {
        tagline:
          "A simple, friendly travel website that makes exploring destinations feel fun and effortless.",
        category: "TRAVEL BOOKING PLATFORM",
      },
      problemStatement: {
        enabled: true,
        heading: "The Challenge",
        description: "International travelers often find existing trip planning platforms clunky and overwhelming. Our goal was to build a modern, high-performance travel guide.",
        images: [{ url: "/assets/Travel World Project Background .png" }]
      }
    },
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "#",
  },
  {
    _id: "fallback-2",
    title: "Triple WAVE",
    slug: "triple-wave",
    sections: {
      hero: {
        heroImage: {
          url: "/assets/Triple Wvee.jpg",
        },
      },
      overview: {
        tagline:
          "A friendly guide for international students in Eindhoven find housing, get around, manage finances, and discover local events.",
        category: "STUDENT GUIDE APPLICATION",
      },
      problemStatement: {
        enabled: true,
        heading: "The Challenge",
        description: "International students often struggle to find reliable housing and navigate the local financial system in Eindhoven. Triple WAVE aims to bridge this gap with an all-in-one intuitive platform.",
        images: [{ url: "/assets/Triple Wvee.jpg", alt: "Triple Wave Challenge" }],
      },
    },
    technologies: ["React", "Node.js", "Express.js"],
    liveUrl: "#",
  },
  {
    _id: "fallback-3",
    title: "Owen Bryce",
    slug: "owen-bryce",
    sections: {
      hero: {
        heroImage: {
          url: "/assets/owen bryce4.png",
        },
      },
      overview: {
        tagline:
          "A comprehensive promotional campaign for an emerging folk/indie artist, creating a cohesive brand identity across multiple platforms",
        category: "ARTIST PORTFOLIO WEBSITE",
      },
      problemStatement: {
        enabled: true,
        heading: "The Challenge",
        description: "Owen Bryce needed to establish his brand identity and promote his debut EP in a crowded music market. We focused on creating a distinctive visual voice.",
        images: [{ url: "/assets/owen bryce4.png" }]
      }
    },
    technologies: ["React", "GSAP", "Tailwind CSS"],
    liveUrl: "#",
  },
];

// Spotlight Project Card (Large Featured)
const SpotlightProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const { title, slug, sections, technologies, liveUrl } = project;
  const imageUrl = sections?.hero?.heroImage?.url || "/assets/Room2.avif";
  const description = sections?.overview?.tagline || "";
  const category = sections?.overview?.category || "PERSONAL PORTFOLIO WEBSITE";

  return (
    <div className="pop-on-scroll relative bg-gradient-to-br from-[var(--card)]/80 via-[var(--card)]/60 to-[var(--card)]/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden group h-full">
      {/* Spotlight Badge */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2 bg-[var(--background)]/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
        <span className="text-xs font-semibold tracking-wider text-[var(--text)]">
          Spotlight
        </span>
      </div>

      {/* Background Image */}
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={90}
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Category Label */}
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--secondary-text)] uppercase">
          {category}
        </p>

        {/* Title */}
        <h3 className="text-3xl font-bold text-[var(--headline)] font-primary">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--text)] leading-relaxed">
          {description}
        </p>

        {/* Technologies */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1.5 bg-[var(--Secondary-Background)] text-[var(--text)] rounded-md border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Link
            href={`/projects/${slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--background)] hover:bg-[var(--Secondary-Background)] text-[var(--headline)] rounded-xl border border-white/10 transition-all duration-300 text-sm font-semibold"
          >
            View details
            <ArrowRight className="w-4 h-4" />
          </Link>
          {liveUrl && liveUrl !== "#" && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] rounded-xl border border-[var(--accent)]/30 transition-all duration-300 text-sm font-semibold"
            >
              Live demo
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact Project Card (Smaller Cards in List)
const CompactProjectCard: React.FC<{
  project: Project;
  index: number;
  onClick: () => void;
}> = ({ project, index, onClick }) => {
  const { title, sections, technologies } = project;
  const description = sections?.overview?.tagline || "";
  const category = sections?.overview?.category || "PERSONAL PORTFOLIO WEBSITE";

  return (
    <button
      onClick={onClick}
      className="pop-on-scroll block w-full text-left bg-gradient-to-br from-[var(--card)]/50 via-[var(--card)]/30 to-transparent backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-[var(--accent)]/30 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--secondary-text)] uppercase mb-3 text-left">
            {category}
          </p>
          <h4 className="text-xl font-bold text-[var(--headline)] font-primary mb-2 group-hover:text-[var(--accent)] transition-colors text-left">
            {title}
          </h4>
        </div>
        <span className="text-3xl font-bold text-[var(--secondary-text)]/30 font-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <p className="text-sm text-[var(--text)] leading-relaxed mb-4 line-clamp-2 text-left">
        {description}
      </p>

      {/* Technologies */}
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-start">
          {technologies.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 bg-[var(--Secondary-Background)] text-[var(--text)] rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </button>
  );
};

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();

        if (
          result.success &&
          result.data.featuredProjects &&
          result.data.featuredProjects.length > 0
        ) {
          // Filter and sort visible projects, ensure projectId is populated
          const visibleProjects = result.data.featuredProjects
            .filter((ref: ProjectReference) => ref.isVisible && ref.projectId)
            .sort(
              (a: ProjectReference, b: ProjectReference) => a.order - b.order,
            )
            .map((ref: ProjectReference) => ref.projectId);

          if (visibleProjects.length > 0) {
            // Remove duplicates by _id
            const uniqueProjects = visibleProjects.filter(
              (project: any, index: number, self: any[]) =>
                index === self.findIndex((p: any) => p._id === project._id),
            );
            setProjects(uniqueProjects);
          }
        }
      } catch (error) {
        // Silently handle fetch errors
        // Keep fallback projects on error
      }
    };

    fetchProjects();
  }, []);

  // Determine the currently spotlighted project
  const spotlightProject = spotlightId
    ? projects.find((p) => p._id === spotlightId) || projects[0]
    : projects[0];

  // The other projects are the ones *not* currently spotlighted
  const otherProjects = projects.filter((p) => p._id !== spotlightProject?._id);

  return (
    <section
      id="projects"
      className="reveal-section py-16 sm:py-20 md:py-24 font-[var(--font-secondary)] min-h-screen relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          {/* Top Label */}
          <p className="text-xs font-semibold tracking-[0.3em] text-[var(--secondary-text)] uppercase mb-4 reveal-el">
            PROJECT CAPSULE
          </p>

          {/* Main Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-6">
            <div>
              <h2 className="split-text text-4xl sm:text-5xl md:text-6xl font-bold">
                <span className="text-[var(--secondary-text)]/50 font-light">
                  Featured
                </span>{" "}
                <span className="text-[var(--headline)]">Projects</span>
              </h2>
              <p className="text-sm text-[var(--text)] mt-3 reveal-el">
                Top picks · Live previews · Case study ready
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#projects"
                className="magnetic-el px-6 py-3 bg-[var(--background)] hover:bg-[var(--Secondary-Background)] text-[var(--headline)] rounded-xl border border-white/10 transition-all duration-300 text-sm font-semibold"
              >
                View all projects
              </Link>
              <Link
                href="/#contact"
                className="magnetic-el px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl transition-all duration-300 text-sm font-semibold"
              >
                Start a project
              </Link>
            </div>
          </div>

          {/* Divider Line */}
          <div className="h-px bg-gradient-to-r from-[var(--accent)]/30 via-[var(--accent)]/10 to-transparent reveal-el" />
        </div>

        {/* Projects Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Spotlight Project */}
          {spotlightProject && (
            <div className="lg:row-span-2 relative transition-all duration-500 ease-in-out">
              <SpotlightProjectCard project={spotlightProject} />
            </div>
          )}

          {/* Right: Other Projects */}
          <div className="space-y-6">
            {otherProjects.map((project, index) => (
              <CompactProjectCard
                key={project._id}
                project={project}
                index={index}
                onClick={() => setSpotlightId(project._id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
