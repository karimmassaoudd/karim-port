"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdClose,
  MdOpenInNew,
  MdSearch,
} from "react-icons/md";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageAnimator from "@/components/PageAnimator";

gsap.registerPlugin(ScrollTrigger);

type ProjectImage = {
  url?: string;
  alt?: string;
};

type Project = {
  _id: string;
  title: string;
  slug: string;
  detailHref?: string;
  shortDescription?: string;
  thumbnail?: ProjectImage;
  technologies?: string[];
  sections?: {
    hero?: {
      category?: string;
      heroImage?: ProjectImage;
    };
    overview?: {
      tagline?: string;
      category?: string;
    };
    websitePreview?: {
      liveUrl?: string;
    };
  };
};

type FallbackProjectInput = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  alt: string;
  technologies: string[];
  liveUrl?: string;
  detailHref?: string;
};

const createFallbackProject = ({
  id,
  title,
  slug,
  description,
  category,
  image,
  alt,
  technologies,
  liveUrl,
  detailHref,
}: FallbackProjectInput): Project => ({
  _id: id,
  title,
  slug,
  detailHref,
  shortDescription: description,
  thumbnail: {
    url: image,
    alt,
  },
  technologies,
  sections: {
    hero: {
      category,
      heroImage: {
        url: image,
        alt,
      },
    },
    overview: {
      tagline: description,
      category,
    },
    websitePreview: liveUrl ? { liveUrl } : undefined,
  },
});

const fallbackProjects: Project[] = [
  createFallbackProject({
    id: "fallback-travel-world",
    title: "Travel World",
    slug: "travel-world",
    detailHref: "/projects/travel-world",
    description:
      "A simple, friendly travel website that makes exploring destinations feel fun and effortless.",
    category: "Travel Website",
    image: "/assets/project-travel-world-screenshot.png",
    alt: "Travel World website preview",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://travelworld.karimmassaoud.cv/",
  }),
  createFallbackProject({
    id: "fallback-taw-tours",
    title: "TAW Tours",
    slug: "taw-tours",
    detailHref: "https://taw.tours/en",
    description:
      "A travel and tours platform for browsing destinations, packages, and booking journeys online.",
    category: "Travel Booking Platform",
    image: "/assets/project-taw-tours-screenshot.png",
    alt: "TAW Tours travel preview",
    technologies: ["Travel Platform", "Booking Flow", "Responsive Design"],
    liveUrl: "https://taw.tours/en",
  }),
  createFallbackProject({
    id: "fallback-same-n-sterk",
    title: "Same 'n Sterk",
    slug: "same-n-sterk",
    detailHref: "https://same-n-sterk.nl/",
    description:
      "A community-focused website with clear information structure and accessible page navigation.",
    category: "Community Website",
    image: "/assets/project-same-n-sterk-screenshot.png",
    alt: "Same 'n Sterk website preview",
    technologies: ["Web Design", "CMS", "Accessibility"],
    liveUrl: "https://same-n-sterk.nl/",
  }),
  createFallbackProject({
    id: "fallback-os-iconk",
    title: "OS IconK",
    slug: "os-iconk",
    detailHref: "https://os.iconk.site/login",
    description:
      "A secure operations login portal designed for focused administrative workflows.",
    category: "Operations Dashboard",
    image: "/assets/project-os-iconk-dashboard.png",
    alt: "OS IconK dashboard preview",
    technologies: ["Dashboard", "Authentication", "Admin UI"],
    liveUrl: "https://os.iconk.site/login",
  }),
  createFallbackProject({
    id: "fallback-taidup",
    title: "Taidup",
    slug: "taidup",
    detailHref: "https://taidup.iconk.site/",
    description:
      "A web application interface built around clean task flows and practical user interactions.",
    category: "Web Application",
    image: "/assets/project-taidup-screenshot.png",
    alt: "Taidup website preview",
    technologies: ["Web App", "UX/UI", "Frontend"],
    liveUrl: "https://taidup.iconk.site/",
  }),
  createFallbackProject({
    id: "fallback-triple-wave",
    title: "Triple WAVE",
    slug: "triple-wave",
    detailHref: "/projects/triple-wave",
    description:
      "A friendly guide for international students in Eindhoven to find housing, get around, manage finances, and discover local events.",
    category: "Student Guide Platform",
    image: "/assets/project-triple-wave-screenshot.png",
    alt: "Triple WAVE platform preview",
    technologies: ["React", "UX Research", "Responsive Design"],
    liveUrl: "https://triple-wave.netlify.app/",
  }),
  createFallbackProject({
    id: "fallback-owen-bryce",
    title: "Owen Bryce",
    slug: "owen-bryce",
    detailHref: "/projects/owen-bryce",
    description:
      "A promotional campaign for an emerging folk/indie artist, creating a cohesive brand identity across multiple platforms.",
    category: "Artist Branding Campaign",
    image: "/assets/Owen Bryce Project Background .png",
    alt: "Owen Bryce branding preview",
    technologies: ["Branding", "Campaign Design", "Social Media"],
  }),
];

const loadingProjectCards = [
  "travel-preview",
  "platform-preview",
  "community-preview",
  "dashboard-preview",
  "application-preview",
  "case-study-preview",
];

const getProjectCategory = (project: Project) =>
  project.sections?.hero?.category ||
  project.sections?.overview?.category ||
  "Case Study";

const getProjectDescription = (project: Project) =>
  project.shortDescription ||
  project.sections?.overview?.tagline ||
  "No description available";

const getProjectImage = (project: Project) =>
  project.thumbnail?.url || project.sections?.hero?.heroImage?.url;

const getProjectLiveUrl = (project: Project) =>
  project.sections?.websitePreview?.liveUrl;

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

const mergeProjectsToTen = (primaryProjects: Project[]) => {
  const seen = new Set<string>();
  const merged: Project[] = [];

  [...fallbackProjects, ...primaryProjects].forEach((project) => {
    const key = project.slug || project._id;
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(project);
  });

  return merged.slice(0, 10);
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

  const headerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/projects?status=published");
      const result = await response.json();
      const publishedProjects =
        result.success && Array.isArray(result.data) ? result.data : [];
      const nextProjects = mergeProjectsToTen(publishedProjects);

      setProjects(nextProjects);

      const uniqueCategories = new Set<string>(["All"]);
      nextProjects.forEach((project: Project) => {
        const category = getProjectCategory(project);
        if (category) uniqueCategories.add(category);
      });
      setCategories(Array.from(uniqueCategories));
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects(fallbackProjects);
      setCategories([
        "All",
        ...Array.from(new Set(fallbackProjects.map(getProjectCategory))),
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !normalizedQuery ||
        project.title.toLowerCase().includes(normalizedQuery) ||
        getProjectDescription(project).toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        selectedCategory === "All" ||
        getProjectCategory(project) === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  const filteredProjectCount = filteredProjects.length;
  const visibleCountLabel = loading
    ? "Loading projects"
    : `${filteredProjects.length} of ${projects.length} projects`;
  const hasActiveFilters =
    Boolean(searchQuery.trim()) || selectedCategory !== "All";

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  useEffect(() => {
    if (loading) return;
    if (filteredProjectCount === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(
        [
          badgeRef.current,
          headerRef.current,
          searchRef.current,
          filtersRef.current,
        ],
        {
          opacity: 0,
          y: 14,
        },
      );

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      })
        .to(
          headerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.35",
        )
        .to(
          searchRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.35",
        )
        .to(
          filtersRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.35",
        );

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".project-card");
        if (cards.length > 0) {
          gsap.set(cards, { opacity: 0, y: 20 });
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        }
      }
    });

    return () => ctx.revert();
  }, [loading, filteredProjectCount]);

  return (
    <>
      <Header />
      <PageAnimator>
        <main className="min-h-screen bg-[var(--background)] pt-28 pb-20 text-[var(--text)]">
          <section className="border-b border-[var(--border)]/70">
            <div className="container mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="mb-10 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)]/60 px-4 py-2 text-sm font-semibold text-[var(--secondary-text)] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
              >
                <MdArrowBack className="h-4 w-4" aria-hidden="true" />
                Back to Home
              </Link>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
                <div ref={headerRef}>
                  <div
                    ref={badgeRef}
                    className="mb-5 inline-flex items-center rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]"
                  >
                    Portfolio
                  </div>
                  <h1 className="max-w-4xl text-4xl font-bold leading-[0.95] text-[var(--headline)] sm:text-5xl lg:text-6xl">
                    All Projects
                  </h1>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--secondary-text)] sm:text-lg">
                    A focused collection of live builds, product interfaces,
                    client websites, and case-study ready work.
                  </p>
                </div>

                <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md">
                  <div className="border-r border-[var(--border)] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--secondary-text)]">
                      Showing
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[var(--headline)]">
                      {filteredProjects.length}
                    </p>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--secondary-text)]">
                      Categories
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[var(--headline)]">
                      {Math.max(categories.length - 1, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
            <section className="relative z-10 mb-10 rounded-xl border border-[var(--border)] bg-[var(--background)]/95 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div
                  className="relative w-full lg:max-w-md"
                  ref={searchRef}
                  suppressHydrationWarning
                >
                  <MdSearch
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--secondary-text)]"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    placeholder="Search projects"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)]/90 pl-10 pr-10 text-[0.75rem] font-medium text-[var(--text)] outline-none transition-colors placeholder:text-[var(--secondary-text)] focus:border-[var(--accent)]"
                    suppressHydrationWarning
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--secondary-text)] transition-colors hover:bg-[var(--Secondary-Background)] hover:text-[var(--headline)]"
                      aria-label="Clear search"
                    >
                      <MdClose className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <p className="min-w-fit text-xs font-semibold text-[var(--secondary-text)]">
                    {visibleCountLabel}
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-[var(--border)] px-3 text-xs font-semibold text-[var(--secondary-text)] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2" ref={filtersRef}>
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={selectedCategory === category}
                    className={`min-h-8 min-w-fit rounded-lg border px-3 text-[0.72rem] font-bold transition-all ${
                      selectedCategory === category
                        ? "border-white bg-white text-black shadow-sm"
                        : "border-[var(--border)] bg-[var(--card)]/50 text-[var(--secondary-text)] hover:border-[var(--accent)]/50 hover:text-[var(--headline)]"
                    }`}
                    suppressHydrationWarning
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>

            {loading && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {loadingProjectCards.map((cardId) => (
                  <div
                    key={cardId}
                    className="min-h-[520px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/70"
                  >
                    <div className="aspect-[16/10] animate-pulse bg-[var(--Secondary-Background)]" />
                    <div className="space-y-4 p-6">
                      <div className="h-5 w-2/3 animate-pulse rounded bg-[var(--Secondary-Background)]" />
                      <div className="h-4 w-full animate-pulse rounded bg-[var(--Secondary-Background)]" />
                      <div className="h-4 w-4/5 animate-pulse rounded bg-[var(--Secondary-Background)]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredProjects.length === 0 && (
              <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]/60 px-6 py-16 text-center">
                <p className="text-xl font-bold text-[var(--headline)]">
                  {searchQuery || selectedCategory !== "All"
                    ? "No projects found"
                    : "No projects published yet. Check back soon!"}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-bold text-black transition-colors hover:bg-gray-100"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}

            {!loading && filteredProjects.length > 0 && (
              <div
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                ref={gridRef}
              >
                {filteredProjects.map((project) => {
                  const detailsHref =
                    project.detailHref || `/projects/${project.slug}`;
                  const liveUrl = getProjectLiveUrl(project);
                  const detailsIsExternal = isExternalHref(detailsHref);
                  const imageUrl = getProjectImage(project);
                  const imageAlt =
                    project.thumbnail?.alt ||
                    project.sections?.hero?.heroImage?.alt ||
                    project.title;

                  return (
                    <div
                      key={project._id}
                      className="project-card group relative flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]/90 shadow-[0_18px_55px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/45"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--Secondary-Background)]">
                        {getProjectCategory(project) && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="inline-flex min-h-8 items-center rounded-full border border-white/20 bg-black/55 px-3 text-xs font-bold text-white backdrop-blur-md">
                              {getProjectCategory(project)}
                            </span>
                          </div>
                        )}
                        {liveUrl && (
                          <div className="absolute right-4 top-4 z-10">
                            <span className="inline-flex min-h-8 items-center rounded-full border border-emerald-300/30 bg-emerald-500/15 px-3 text-xs font-bold text-emerald-100 backdrop-blur-md">
                              Live
                            </span>
                          </div>
                        )}

                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[var(--Secondary-Background)] text-[var(--secondary-text)]">
                            <span className="text-sm font-semibold">
                              Preview unavailable
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/35 to-transparent" />
                      </div>

                      <div className="relative z-10 flex flex-1 flex-col p-6">
                        <h2 className="mb-3 text-[0.95rem] font-bold normal-case leading-snug text-[var(--headline)] transition-colors group-hover:text-[var(--accent)]">
                          {project.title}
                        </h2>

                        <p className="mb-6 line-clamp-3 flex-1 text-sm leading-7 text-[var(--secondary-text)]">
                          {getProjectDescription(project)}
                        </p>

                        {project.technologies?.length > 0 && (
                          <div className="mb-6 flex flex-wrap gap-2">
                            {project.technologies
                              .slice(0, 4)
                              .map((tech: string) => (
                                <span
                                  key={`${project._id}-${tech}`}
                                  className="inline-flex min-h-8 items-center rounded-md border border-[var(--border)]/70 bg-[var(--Secondary-Background)]/75 px-3 text-xs font-semibold text-[var(--text)]"
                                >
                                  {tech}
                                </span>
                              ))}
                            {project.technologies.length > 4 && (
                              <span className="inline-flex min-h-8 items-center rounded-md border border-[var(--border)]/70 bg-[var(--Secondary-Background)]/75 px-3 text-xs font-semibold text-[var(--text)]">
                                +{project.technologies.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-auto flex gap-3">
                          {detailsIsExternal ? (
                            <a
                              href={detailsHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-black transition-colors hover:bg-gray-100"
                            >
                              View Project
                              <MdArrowForward
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </a>
                          ) : (
                            <Link
                              href={detailsHref}
                              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-black transition-colors hover:bg-gray-100"
                            >
                              View Details
                              <MdArrowForward
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </Link>
                          )}
                          {liveUrl && (
                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--Secondary-Background)] text-[var(--text)] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                              aria-label={`Open ${project.title} live project`}
                            >
                              <MdOpenInNew
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </PageAnimator>
      <Footer />
    </>
  );
}
