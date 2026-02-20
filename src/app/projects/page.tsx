"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdSearch } from "react-icons/md";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageAnimator from "@/components/PageAnimator";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

  // GSAP Animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Animate header elements
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.from(badgeRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
      })
      .from(headerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      }, "-=0.4")
      .from(searchRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
      }, "-=0.4")
      .from(filtersRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
      }, "-=0.4");

      // Animate project cards with stagger
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.project-card');
        gsap.from(cards, {
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });
      }
    });

    return () => ctx.revert();
  }, [loading, filteredProjects.length]);

  // Filter projects based on search and category
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All" ||
      project.sections?.hero?.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
                Explore real client work, experiments, and product builds. Filter by category or search by name.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-10 space-y-5">
              {/* Search Bar */}
              <div className="relative max-w-md" ref={searchRef} suppressHydrationWarning>
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
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      selectedCategory === category
                        ? "bg-[var(--accent)] text-white shadow-lg"
                        : "backdrop-blur-md bg-white/10 dark:bg-white/5 text-[var(--text)] border border-white/20 dark:border-white/10 hover:border-[var(--accent)]"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={gridRef}>
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="project-card group backdrop-blur-xl bg-white/70 dark:bg-[var(--card)]/70 rounded-xl overflow-hidden border border-white/40 dark:border-white/10 hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-white/30 dark:bg-black/20">
                      {/* Category Badge */}
                      {project.sections?.hero?.category && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1.5 bg-[var(--accent)] text-white rounded-md text-xs font-semibold shadow-lg">
                            {project.sections.hero.category}
                          </span>
                        </div>
                      )}
                      
                      {project.thumbnail?.url ? (
                        <img
                          src={project.thumbnail.url}
                          alt={project.thumbnail.alt || project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--secondary-text)]">
                          <span className="text-4xl">📁</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-sm font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight line-clamp-2">
                        {project.title}
                      </h3>
                      
                      <p className="text-[var(--secondary-text)] text-sm mb-5 line-clamp-3 leading-relaxed">
                        {project.shortDescription || project.sections?.overview?.tagline || "No description available"}
                      </p>

                      {/* Technologies */}
                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {project.technologies
                            .slice(0, 4)
                            .map((tech: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-white/50 dark:bg-black/20 text-[var(--text)] rounded-md text-xs font-semibold border border-white/30 dark:border-white/10"
                              >
                                {tech}
                              </span>
                            ))}
                          {project.technologies.length > 4 && (
                            <span className="px-3 py-1.5 text-[var(--secondary-text)] text-xs font-semibold">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* View Details Button */}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center justify-center w-full px-5 py-3 backdrop-blur-md bg-white/30 dark:bg-white/5 text-[var(--text)] border border-white/30 dark:border-white/10 rounded-lg font-semibold text-sm hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all duration-300 group/btn"
                      >
                        <span>View Details</span>
                        <span className="ml-2 group-hover/btn:translate-x-1 transition-transform text-base">→</span>
                      </Link>
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
