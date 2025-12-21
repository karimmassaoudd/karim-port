'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageAnimator from '@/components/PageAnimator';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects?status=published');
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <PageAnimator>
        <main className="min-h-screen bg-[var(--background)] pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-[var(--text)] mb-4">
                Projects
              </h1>
              <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                Explore my portfolio of web development projects, case studies, and creative work
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
              </div>
            )}

            {/* Empty State */}
            {!loading && projects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--text-secondary)] text-lg">
                  No projects published yet. Check back soon!
                </p>
              </div>
            )}

            {/* Projects Grid */}
            {!loading && projects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/projects/${project.slug}`}
                    className="group bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)] hover:shadow-2xl hover:border-[var(--accent)]/50 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-64 overflow-hidden bg-[var(--surface-hover)]">
                      {project.thumbnail?.url ? (
                        <img
                          src={project.thumbnail.url}
                          alt={project.thumbnail.alt}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                          No Image
                        </div>
                      )}
                      {/* Category Badge */}
                      {project.sections?.hero?.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-[var(--accent)] text-white rounded-full text-xs font-medium">
                            {project.sections.hero.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-[var(--text)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] mb-4 line-clamp-3">
                        {project.shortDescription}
                      </p>

                      {/* Technologies */}
                      {project.technologies?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 4).map((tech: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2 py-1 text-[var(--text-secondary)] text-xs">
                              +{project.technologies.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* View Project Link */}
                      <div className="flex items-center text-[var(--accent)] font-medium group-hover:gap-2 transition-all">
                        View Case Study
                        <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
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
