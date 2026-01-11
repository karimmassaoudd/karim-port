"use client";

import { ArrowRight } from "lucide-react";
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
    };
  };
  technologies?: string[];
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
      },
    },
    technologies: [],
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
      },
    },
    technologies: [],
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
      },
    },
    technologies: [],
  },
];

const ProjectCard: React.FC<{ project: Project; priority?: boolean }> = ({
  project,
  priority = false,
}) => {
  const { title, slug, sections, technologies } = project;
  const imageUrl = sections?.hero?.heroImage?.url || "/assets/Room2.avif";
  const description = sections?.overview?.tagline || "";

  return (
    <Link
      href={`/projects/${slug}`}
      className="relative [perspective:1000px] block"
    >
      <div className="tilt-card tilt-card-transform pop-on-scroll w-full max-w-[500px] h-[420px] sm:h-[480px] md:h-[520px] lg:h-[560px] xl:h-[600px] bg-[var(--Secondary-Background)] shadow-xl rounded-xl overflow-hidden relative group cursor-pointer mx-auto">
        {/* 1. Project Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            quality={90}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* 2. Dark Overlay - always visible on mobile, hover on desktop */}
        <div className="absolute inset-0 z-10 transition-colors duration-500 ease-in-out bg-black/60 group-hover:bg-black/70" />

        {/* 3. Content - Always visible with gradient at bottom */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8 text-white">
          {/* Bottom Content - Always visible */}
          <div
            className="
          opacity-100 visible translate-y-0
          transition-all duration-300 ease-out"
          >
            {/* Project Name */}
            <h3 className="project-card-title text-2xl sm:text-3xl font-[var(--font-primary)] font-bold mb-2 tracking-tight text-[var(--accent)]">
              {title.toUpperCase()}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm font-[var(--font-secondary)] font-light leading-relaxed mb-4 line-clamp-3">
              {description}
            </p>

            {/* Technologies */}
            {technologies && technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {technologies.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* View Project Button */}
            <span className="text-white font-semibold text-xs tracking-widest inline-flex items-center font-[var(--font-secondary)] group-hover:text-[var(--accent)] transition-colors">
              VIEW PROJECT{" "}
              <ArrowRight className="inline w-4 h-4 ml-1 -translate-y-[1px]" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

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
              (project, index, self) =>
                index === self.findIndex((p) => p._id === project._id),
            );
            setProjects(uniqueProjects);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Keep fallback projects on error
      }
    };

    fetchProjects();
  }, []);

  // Scroll-based 3D tilt
  useLayoutEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    (async () => {
      const gsapModule = await import("gsap");
      const stModule = await import("gsap/ScrollTrigger");
      const gsap = (gsapModule as any).default ?? (gsapModule as any);
      const ScrollTrigger =
        (stModule as any).ScrollTrigger ?? (stModule as any).default;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        (gsap.utils.toArray(".tilt-card") as HTMLElement[]).forEach(
          (el: HTMLElement) => {
            // set initial slight depth
            gsap.set(el, { z: -60, rotateX: 8 });
            gsap.to(el, {
              z: 0,
              rotateX: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "top 35%",
                scrub: 0.5,
              },
            });
          },
        );
      });

      if (cancelled) {
        // If the component unmounted before we finished initializing, revert immediately
        ctx.revert();
      } else {
        cleanup = () => ctx.revert();
      }
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section
      id="projects"
      className="reveal-section py-12 sm:py-16 md:py-20 font-[var(--font-secondary)] min-h-screen relative overflow-hidden max-w-7xl mx-auto"
    >
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header mimicking the provided image */}
        <div className="flex justify-between items-end mb-12 sm:mb-16">
          <div>
            {/* My Projects */}
            <h4 className="mb-2 text-right body-text-b reveal-el">
              My Projects
            </h4>
            <div className="w-155 h-px bg-[var(--secondary-text)] opacity-50 mb-2 reveal-el" />
            {/* BRINGING IDEAS TO LIFE */}
            <h3 className="font-primary reveal-el">BRINGING IDEAS TO LIFE</h3>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {projects.map((project, index) => (
            <ProjectCard
              key={project._id}
              project={project}
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
