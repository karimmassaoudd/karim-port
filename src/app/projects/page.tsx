"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdSearch } from "react-icons/md";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageAnimator from "@/components/PageAnimator";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
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
      if (result.success) {
        setProjects(result.data);

        // Extract unique categories from projects
        const uniqueCategories = new Set<string>(["All"]);
        result.data.forEach((project: any) => {
          const category = project.sections?.hero?.category;
          if (category) {
            uniqueCategories.add(category);
          }
        });
        setCategories(Array.from(uniqueCategories));
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
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
        project.shortDescription
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        project.sections?.hero?.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  // GSAP Animations
  useEffect(() => {
    if (loading) return;

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
  }, [loading, filteredProjects.length]);

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
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedCategory === category
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
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="group relative flex flex-col overflow-hidden rounded-xl bg-[var(--card)]/90 backdrop-blur-sm border border-[var(--border)] transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      {/* Category Badge */}
                      {project.sections?.hero?.category && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-block px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 text-xs font-medium tracking-wide">
                            {project.sections.hero.category}
                          </span>
                        </div>
                      )}

                      {project.thumbnail?.url ? (
                        <img
                          src={project.thumbnail.url}
                          alt={project.thumbnail.alt || project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                        {project.shortDescription ||
                          project.sections?.overview?.tagline ||
                          "No description available"}
                      </p>

                      {/* Technologies */}
                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.technologies.slice(0, 4).map((tech: string, i: number) => (
                            <span
                              key={i}
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
                        <Link
                          href={`/projects/${project.slug}`}
                          className="flex-1 inline-flex items-center justify-center py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          View Details
                        </Link>
                        {project.sections?.websitePreview?.liveUrl && (
                          <a
                            href={project.sections.websitePreview.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10.5 px-3 bg-[var(--Secondary-Background)] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--border)] transition-colors"
                            aria-label="View Live Project Location"
                          >
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </PageAnimator>
      <Footer />
    </>
  );
}
