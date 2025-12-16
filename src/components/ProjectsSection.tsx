'use client';

import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SectionBackground from './SectionBackground';

// --- Types ---
type Project = {
  title: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
  technologies?: string[];
  isVisible?: boolean;
};

// Fallback projects if database is empty
const fallbackProjects = [
  {
    title: 'Travel World',
    description: 'A simple, friendly travel website that makes exploring destinations feel fun and effortless.',
    imageUrl: '/assets/Travel world Fourth Picture .png',
    projectUrl: 'https://travel-website-complete-w0th.onrender.com/index.html',
    technologies: [],
    isVisible: true,
  },
  {
    title: 'Triple WAVE',
    description: 'A friendly guide for international students in Eindhoven find housing, get around, manage finances, and discover local events.',
    imageUrl: '/assets/Triple Wvee.jpg',
    projectUrl: 'https://triple-wave.netlify.app/',
    technologies: [],
    isVisible: true,
  },
  {
    title: 'Owen Bryce',
    description: 'A comprehensive promotional campaign for an emerging folk/indie artist, creating a cohesive brand identity across multiple platforms',
    imageUrl: '/assets/owen bryce4.png',
    projectUrl: 'https://karimmassaoudd-portfolio-lastversion.netlify.app/html%20files/branding',
    technologies: [],
    isVisible: true,
  },
];

const ProjectCard: React.FC<{ project: Project; priority?: boolean }> = ({ project, priority = false }) => {
  const { title, description, imageUrl, projectUrl } = project;

  return (
    <div className="relative [perspective:1000px]">
      <div
        className="tilt-card tilt-card-transform pop-on-scroll w-full max-w-[500px] h-[420px] sm:h-[480px] md:h-[520px] lg:h-[560px] xl:h-[600px] bg-[var(--Secondary-Background)] shadow-xl rounded-xl overflow-hidden relative group cursor-pointer mx-auto"
      >
      
      {/* 1. Project Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={95}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* 2. Dark Overlay - always visible on mobile, hover on desktop */}
      <div
        className="absolute inset-0 z-10 transition-colors duration-500 ease-in-out bg-black/50 md:bg-black/0 md:group-hover:bg-black/60"
      />
      
      {/* 3. Non-Hover Content - hidden on mobile, visible on desktop until hover */}
      {projectUrl && (
        <a
          href={projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block absolute bottom-5 right-5 z-20 text-white font-medium text-sm transition-opacity duration-300 group-hover:opacity-0"
        >
          SEE MORE <ArrowRight className="inline w-4 h-4 ml-1 -translate-y-[1px]" />
        </a>
      )}

      {/* 4. Hover Content - always visible on mobile, hover on desktop */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 text-white">
        
        {/* VIEW LIVE Link - always visible on mobile */}
        {projectUrl && (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 border border-white px-4 py-2 rounded-full w-fit
                       opacity-100 visible md:opacity-0 md:invisible transition-all duration-300 delay-100 ease-out 
                       md:group-hover:opacity-100 md:group-hover:visible hover:bg-white/10"
          >
            <Eye className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider">VIEW LIVE</span>
          </a>
        )}

        {/* Bottom Content - always visible on mobile */}
        <div className="
          opacity-100 visible translate-y-0
          md:opacity-0 md:invisible md:translate-y-4
          transition-all duration-300 delay-150 ease-out 
          md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0"
        >
          {/* Project Name */}
          <h3 className="project-card-title text-2xl sm:text-3xl font-[var(--font-primary)] font-bold mb-2 tracking-tight text-[var(--accent)]">
            {title.toUpperCase()}
          </h3>
          
          {/* Description */}
          <p className="text-xs sm:text-sm font-[var(--font-secondary)] font-light leading-relaxed mb-4">
            {description}
          </p>

          {/* View Project Button */}
          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold text-xs tracking-widest block w-fit font-[var(--font-secondary)]"
            >
              VIEW PROJECT <ArrowRight className="inline w-4 h-4 ml-1 -translate-y-[1px]" />
            </a>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/homepage');
        const result = await response.json();
        
        if (result.success && result.data.projects && result.data.projects.length > 0) {
          // Filter only visible projects
          const visibleProjects = result.data.projects.filter((p: Project) => p.isVisible);
          if (visibleProjects.length > 0) {
            setProjects(visibleProjects);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
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
      const gsapModule = await import('gsap');
      const stModule = await import('gsap/ScrollTrigger');
      const gsap = (gsapModule as any).default ?? (gsapModule as any);
      const ScrollTrigger = (stModule as any).ScrollTrigger ?? (stModule as any).default;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        (gsap.utils.toArray('.tilt-card') as HTMLElement[]).forEach((el: HTMLElement) => {
          // set initial slight depth
          gsap.set(el, { z: -60, rotateX: 8 });
          gsap.to(el, {
            z: 0,
            rotateX: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 35%',
              scrub: 0.5,
            },
          });
        });
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
    <section id="projects" className="reveal-section py-12 sm:py-16 md:py-20 font-[var(--font-secondary)] min-h-screen relative overflow-hidden max-w-7xl mx-auto">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header mimicking the provided image */}
        <div className="flex justify-between items-end mb-12 sm:mb-16">
          <div>
            {/* My Projects */}
            <h4 className="mb-2 text-right body-text-b reveal-el">My Projects</h4>
            <div className="w-155 h-px bg-[var(--secondary-text)] opacity-50 mb-2 reveal-el" />
            {/* BRINGING IDEAS TO LIFE */}
            <h3 className="font-primary reveal-el">
              BRINGING IDEAS TO LIFE
            </h3>
          </div>
          
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} priority={index === 0} />
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default ProjectsSection;
