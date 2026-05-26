"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdOpenInNew, MdSearch } from "react-icons/md";
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
  createFallbackProject({
    id: "fallback-travel-offers",
    title: "Travel Offers UI",
    slug: "travel-offers-ui",
    detailHref: "/projects/travel-world",
    description:
      "A focused offer-card interface for presenting travel deals, discounts, and booking actions.",
    category: "UI Design",
    image: "/assets/special offer.png",
    alt: "Travel offers interface preview",
    technologies: ["UI Design", "Cards", "Conversion"],
  }),
  createFallbackProject({
    id: "fallback-eindhoven-local-events",
    title: "Eindhoven Local Events",
    slug: "eindhoven-local-events",
    detailHref: "/projects/triple-wave",
    description:
      "A local discovery experience helping international students find events and social places.",
    category: "Student Experience",
    image: "/assets/Local Event 2.webp",
    alt: "Eindhoven local events preview",
    technologies: ["UX Research", "Information Design", "Mobile UX"],
  }),
  createFallbackProject({
    id: "fallback-owen-campaign-assets",
    title: "Owen Bryce Campaign Assets",
    slug: "owen-bryce-campaign-assets",
    detailHref: "/projects/owen-bryce",
    description:
      "A set of social media, poster, and identity assets for a cohesive artist promotion campaign.",
    category: "Brand Assets",
    image: "/assets/Social Media Owen Bcryce .png",
    alt: "Owen Bryce campaign asset preview",
    technologies: ["Branding", "Print Design", "Social Media"],
  }),
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

  // Refs for GSAP animations
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

      // Extract unique categories from projects
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

  // Filter projects based on search and category
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getProjectDescription(project)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        getProjectCategory(project) === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  const filteredProjectCount = filteredProjects.length;

  // GSAP Animations
  useEffect(() => {
    if (loading) return;
    if (filteredProjectCount === 0) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(
        [
          badgeRef.current,
          headerRef.current,
          searchRef.current,
          filtersRef.current,
        ],
        {
          opacity: 0,
        },
      );

      // Animate header elements
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      })
        .to(
          headerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          "-=0.5",
        )
        .to(
          searchRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5",
        )
        .to(
          filtersRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5",
        );

      // Animate project cards with stagger
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".project-card");
        if (cards.length > 0) {
          gsap.set(cards, { opacity: 0 });
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.15,
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
        <main className="min-h-screen bg-[var(--background)] pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Back to Home Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--secondary-text)] hover:text-[var(--accent)] transition-colors mb-8"
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>

            {/* Header */}
            <div className="mb-12" ref={headerRef}>
              <div
                ref={badgeRef}
                className="inline-block px-4 py-1.5 backdrop-blur-md bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] rounded-full text-xs font-semibold mb-5 tracking-wide"
              >
                PORTFOLIO
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 pop-on-scroll leading-tight">
                Featured Projects & Case Studies
              </h3>
              <p className="text-base text-[var(--secondary-text)] max-w-3xl leading-relaxed">
                Explore real client work, experiments, and product builds.
                Filter by category or search by name.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-10 space-y-5">
              {/* Search Bar */}
              <div
                className="relative max-w-md"
                ref={searchRef}
                suppressHydrationWarning
              >
                <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--secondary-text)] text-xl" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-lg text-[var(--text)] placeholder:text-[var(--secondary-text)] focus:outline-none focus:border-[var(--accent)] transition-colors text-sm"
                  suppressHydrationWarning
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-3" ref={filtersRef}>
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-white text-black shadow-md border-transparent"
                        : "bg-transparent text-[var(--secondary-text)] border border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                    }`}
                    suppressHydrationWarning
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--secondary-text)] text-lg">
                  {searchQuery || selectedCategory !== "All"
                    ? "No projects found matching your criteria."
                    : "No projects published yet. Check back soon!"}
                </p>
              </div>
            )}

            {/* Projects Grid */}
            {!loading && filteredProjects.length > 0 && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                      className="group relative flex flex-col overflow-hidden rounded-xl bg-[var(--card)]/90 backdrop-blur-sm border border-[var(--border)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        {/* Category Badge */}
                        {getProjectCategory(project) && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="inline-block px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 text-xs font-medium tracking-wide">
                              {getProjectCategory(project)}
                            </span>
                          </div>
                        )}

                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[var(--Secondary-Background)] text-[var(--secondary-text)]">
                            <span className="text-4xl text-white/10">📁</span>
                          </div>
                        )}
                        {/* Dark gradient overlay for smooth transition to content */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)]/90 via-transparent to-transparent opacity-60"></div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-6 relative z-10">
                        <h3 className="text-xl font-bold text-[var(--headline)] mb-3 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                          {project.title}
                        </h3>

                        <p className="text-sm text-[var(--secondary-text)] mb-6 flex-1 line-clamp-3 leading-relaxed">
                          {getProjectDescription(project)}
                        </p>

                        {/* Technologies */}
                        {project.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.technologies
                              .slice(0, 4)
                              .map((tech: string) => (
                                <span
                                  key={`${project._id}-${tech}`}
                                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-[var(--Secondary-Background)] text-[var(--text)] border border-[var(--border)]/50"
                                >
                                  {tech}
                                </span>
                              ))}
                            {project.technologies.length > 4 && (
                              <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-[var(--Secondary-Background)] text-[var(--text)] border border-[var(--border)]/50">
                                +{project.technologies.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {/* View Details Button & Link */}
                        <div className="mt-auto flex gap-3">
                          {detailsIsExternal ? (
                            <a
                              href={detailsHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              View Project
                            </a>
                          ) : (
                            <Link
                              href={detailsHref}
                              className="flex-1 inline-flex items-center justify-center py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              View Details
                            </Link>
                          )}
                          {liveUrl && (
                            <a
                              href={liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-10.5 px-3 bg-[var(--Secondary-Background)] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--border)] transition-colors"
                              aria-label={`Open ${project.title} live project`}
                            >
                              <MdOpenInNew aria-hidden="true" />
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
