'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageAnimator from '@/components/PageAnimator';
import { MdArrowBack, MdArrowForward, MdOpenInNew } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [resolvedParams.slug]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects?slug=${resolvedParams.slug}`);
      const result = await response.json();
      
      if (result.success) {
        // Only show if published
        if (result.data.status === 'published') {
          setProject(result.data);
        } else {
          router.push('/projects');
        }
      } else {
        router.push('/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <PageAnimator>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
          </div>
          <Footer />
        </PageAnimator>
      </>
    );
  }

  if (!project) {
    return null;
  }

  const { sections } = project;

  return (
    <>
      <Header />
      <PageAnimator>
        <main className="min-h-screen bg-[var(--background)]">
          {/* Back Button */}
          <div className="container mx-auto px-6 pt-28 pb-8 max-w-6xl">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300 font-secondary"
            >
              <MdArrowBack size={20} />
              <span>Back to Projects</span>
            </Link>
          </div>

          {/* Hero Section */}
          {sections.hero?.enabled && (
            <section className="container mx-auto px-6 pb-16 max-w-6xl">
              <div className="text-center mb-12 pop-on-scroll">
                <span className="inline-block px-4 py-2 bg-[var(--Secondary-Background)] text-[var(--accent)] rounded-lg text-sm font-semibold mb-6 font-secondary">
                  {sections.hero.category}
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--headline)] mb-6 font-primary leading-tight">
                  {sections.hero.title}
                </h1>
                <p className="text-xl md:text-2xl text-[var(--text)] max-w-3xl mx-auto font-secondary leading-relaxed">
                  {sections.hero.tagline}
                </p>
              </div>
              {sections.hero.heroImage?.url && (
                <div className="pop-on-scroll rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={sections.hero.heroImage.url}
                    alt={sections.hero.heroImage.alt}
                    className="w-full h-auto"
                  />
                  {sections.hero.heroImage.caption && (
                    <p className="text-center text-sm text-[var(--secondary-text)] mt-4 font-secondary">
                      {sections.hero.heroImage.caption}
                    </p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Project Overview */}
          {sections.overview?.enabled && (
            <section className="bg-[var(--Secondary-Background)] py-20">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8 pop-on-scroll">
                    <div>
                      <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                        Overview
                      </h2>
                      <p className="text-lg text-[var(--text)] leading-relaxed font-secondary">
                        {sections.overview.description}
                      </p>
                    </div>
                    {sections.overview.keyFeatures?.length > 0 && (
                      <div className="bg-[var(--card)] rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-[var(--headline)] mb-4 font-primary">
                          Key Features
                        </h3>
                        <ul className="space-y-3">
                          {sections.overview.keyFeatures.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3 text-[var(--text)] font-secondary">
                              <span className="text-[var(--accent)] mt-1 flex-shrink-0">→</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="space-y-6 pop-on-scroll">
                    <div className="bg-[var(--card)] rounded-xl p-8 shadow-lg space-y-6">
                      {sections.overview.client && (
                      <div className="group">
                        <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                          Client
                        </h4>
                        <p className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{sections.overview.client}</p>
                      </div>
                    )}
                    {sections.overview.timeline && (
                      <div className="group">
                        <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                          Timeline
                        </h4>
                        <p className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{sections.overview.timeline}</p>
                      </div>
                    )}
                    {sections.overview.role && (
                      <div className="group">
                        <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                          Role
                        </h4>
                        <p className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{sections.overview.role}</p>
                      </div>
                    )}
                    {sections.overview.team && (
                      <div className="group">
                        <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                          Team
                        </h4>
                        <p className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{sections.overview.team}</p>
                      </div>
                    )}
                    {project.technologies?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/5 text-[var(--accent)] rounded-xl text-sm font-semibold border border-[var(--accent)]/20 hover:border-[var(--accent)]/40 hover:shadow-lg hover:shadow-[var(--accent)]/10 transition-all duration-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Problem Statement */}
          {sections.problemStatement?.enabled && (
            <section className="py-16">
              <div className="container mx-auto px-4 max-w-4xl">
                <h2 className="text-3xl font-bold text-[var(--text)] mb-6">
                  {sections.problemStatement.heading}
                </h2>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                  {sections.problemStatement.description}
                </p>
              </div>
            </section>
          )}

          {/* Solutions */}
          {sections.solutions?.enabled && (
            <section className="bg-[var(--Secondary-Background)] py-20">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="bg-[var(--card)] rounded-xl shadow-xl p-8 md:p-12 pop-on-scroll">
                  <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                    {sections.solutions.heading}
                  </h2>
                  <p className="text-lg text-[var(--text)] leading-relaxed mb-8 font-secondary">
                    {sections.solutions.description}
                  </p>
                  {sections.solutions.solutions?.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      {sections.solutions.solutions.map((solution: any, idx: number) => (
                        <div key={idx} className="bg-[var(--Secondary-Background)] p-6 rounded-lg">
                          <h4 className="text-lg font-semibold text-[var(--headline)] mb-3 font-primary">{solution.title}</h4>
                          <p className="text-[var(--text)] font-secondary">{solution.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Branding */}
          {sections.branding?.enabled && (
            <section className="py-20">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-12 pop-on-scroll">
                  <h2 className="text-4xl font-bold text-[var(--headline)] mb-4 font-primary">
                    {sections.branding.heading}
                  </h2>
                  <p className="text-lg text-[var(--text)] max-w-3xl mx-auto font-secondary">
                    {sections.branding.description}
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Logo */}
                  {sections.branding.logo?.url && (
                    <div className="bg-[var(--card)] rounded-xl shadow-xl p-12 flex items-center justify-center pop-on-scroll">
                      <img
                        src={sections.branding.logo.url}
                        alt={sections.branding.logo.alt}
                        className="max-w-full h-auto max-h-64 object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-6 pop-on-scroll">
                    {/* Color Palette */}
                    {sections.branding.colorPalette && (
                      <div className="bg-[var(--card)] rounded-xl shadow-xl p-6">
                        <h3 className="text-xl font-semibold text-[var(--headline)] mb-4 font-primary">Color Palette</h3>
                        <div className="flex gap-4">
                          {sections.branding.colorPalette.primary && (
                            <div className="flex-1">
                              <div
                                className="w-full h-24 rounded-lg shadow-lg mb-2"
                                style={{ backgroundColor: sections.branding.colorPalette.primary }}
                              />
                              <p className="text-sm text-[var(--secondary-text)] text-center font-secondary">
                                {sections.branding.colorPalette.primary}
                              </p>
                            </div>
                          )}
                          {sections.branding.colorPalette.secondary && (
                            <div className="flex-1">
                              <div
                                className="w-full h-24 rounded-lg shadow-lg mb-2"
                                style={{ backgroundColor: sections.branding.colorPalette.secondary }}
                              />
                              <p className="text-sm text-[var(--text-secondary)] text-center">
                                {sections.branding.colorPalette.secondary}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Typography */}
                    {sections.branding.typography && (
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Typography</h3>
                        <div className="space-y-2">
                          {sections.branding.typography.primary && (
                            <p className="text-[var(--text-secondary)]">
                              <span className="font-medium text-[var(--text)]">Primary:</span> {sections.branding.typography.primary}
                            </p>
                          )}
                          {sections.branding.typography.secondary && (
                            <p className="text-[var(--text-secondary)]">
                              <span className="font-medium text-[var(--text)]">Secondary:</span> {sections.branding.typography.secondary}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Wireframes */}
          {sections.wireframes?.enabled && (
            <section className="py-20">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-12 pop-on-scroll">
                  <h2 className="text-4xl font-bold text-[var(--headline)] mb-4 font-primary">
                    {sections.wireframes.heading}
                  </h2>
                  <p className="text-lg text-[var(--text)] max-w-3xl mx-auto font-secondary">
                    {sections.wireframes.description}
                  </p>
                </div>
                {sections.wireframes.wireframes?.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-8">
                    {sections.wireframes.wireframes.map((image: any, idx: number) => (
                      <div key={idx} className="pop-on-scroll rounded-xl overflow-hidden shadow-xl bg-[var(--card)]">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-auto"
                        />
                        {image.alt && (
                          <p className="text-sm text-[var(--secondary-text)] mt-3 text-center px-4 pb-4 font-secondary">{image.alt}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* UI/UX Design */}
          {sections.uiuxDesign?.enabled && (
            <section className="bg-[var(--Secondary-Background)] py-20">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-12 pop-on-scroll">
                  <h2 className="text-4xl font-bold text-[var(--headline)] mb-4 font-primary">
                    {sections.uiuxDesign.heading}
                  </h2>
                  <p className="text-lg text-[var(--text)] max-w-3xl mx-auto font-secondary">
                    {sections.uiuxDesign.description}
                  </p>
                </div>
                {sections.uiuxDesign.mockups?.length > 0 && (
                  <div className="space-y-8">
                    {sections.uiuxDesign.mockups.map((mockup: any, idx: number) => (
                      <div key={idx} className="pop-on-scroll rounded-xl overflow-hidden shadow-2xl bg-[var(--card)]">
                        <img
                          src={mockup.url}
                          alt={mockup.alt}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Development Process */}
          {sections.developmentProcess?.enabled && (
            <section className="bg-[var(--Secondary-Background)] py-20">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="bg-[var(--card)] rounded-xl shadow-xl p-8 md:p-12 pop-on-scroll">
                  <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 text-center font-primary">
                    {sections.developmentProcess.heading}
                  </h2>
                  <p className="text-lg text-[var(--text)] text-center mb-12 max-w-3xl mx-auto font-secondary">
                    {sections.developmentProcess.description}
                  </p>
                  {sections.developmentProcess.techStack?.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--headline)] mb-6 text-center font-primary">Tech Stack</h3>
                      <div className="flex flex-wrap justify-center gap-3">
                        {sections.developmentProcess.techStack.map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-[var(--Secondary-Background)] text-[var(--accent)] rounded-lg text-sm font-semibold font-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Website Preview */}
          {sections.websitePreview?.enabled && (
            <section className="py-20">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="bg-[var(--card)] rounded-xl shadow-xl p-8 md:p-12 pop-on-scroll">
                  <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 text-center font-primary">
                    {sections.websitePreview.heading}
                  </h2>
                  <p className="text-lg text-[var(--text)] text-center mb-8 font-secondary">
                    {sections.websitePreview.description}
                  </p>
                  <div className="flex justify-center gap-4 mb-8">
                    {sections.websitePreview.liveUrl && (
                      <a
                        href={sections.websitePreview.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary flex items-center gap-2"
                      >
                        <MdOpenInNew size={20} />
                        View Live Site
                      </a>
                    )}
                    {sections.websitePreview.githubUrl && (
                      <a
                        href={sections.websitePreview.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary flex items-center gap-2"
                      >
                        <FaGithub size={20} />
                        View Code
                      </a>
                    )}
                  </div>
                  {sections.websitePreview.screenshots?.map((screenshot: any, idx: number) => (
                    <div key={idx} className="mb-6">
                      <img
                        src={screenshot.url}
                        alt={screenshot.alt}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Results & Impact */}
          {sections.resultsImpact?.enabled && (
            <section className="bg-[var(--Secondary-Background)] py-20">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-12 pop-on-scroll">
                  <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                    {sections.resultsImpact.heading}
                  </h2>
                  <p className="text-lg text-[var(--text)] max-w-3xl mx-auto font-secondary">
                    {sections.resultsImpact.description}
                  </p>
                </div>
                {sections.resultsImpact.metrics?.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-6">
                    {sections.resultsImpact.metrics.map((metric: any, idx: number) => (
                      <div key={idx} className="bg-[var(--card)] text-center p-8 rounded-xl shadow-xl pop-on-scroll">
                        <div className="text-5xl font-bold text-[var(--accent)] mb-3 font-primary">
                          {metric.value}
                        </div>
                        <p className="text-[var(--text)] font-semibold font-secondary">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Conclusion */}
          {sections.conclusion?.enabled && (
            <section className="py-20">
              <div className="container mx-auto px-6 max-w-6xl">
                <div className="bg-[var(--card)] rounded-xl shadow-xl p-8 md:p-12 pop-on-scroll">
                  <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                    {sections.conclusion.heading}
                  </h2>
                  <p className="text-lg text-[var(--text)] leading-relaxed mb-8 font-secondary">
                    {sections.conclusion.description}
                  </p>
                {sections.conclusion.lessonsLearned?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Key Takeaways</h3>
                    <ul className="space-y-3">
                      {sections.conclusion.lessonsLearned.map((lesson: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-[var(--text-secondary)]">
                          <span className="text-[var(--accent)] text-2xl leading-none">•</span>
                          <span className="flex-1">{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {sections.conclusion.futureImprovements?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-[var(--text)] mb-4">Future Improvements</h3>
                    <ul className="space-y-3">
                      {sections.conclusion.futureImprovements.map((improvement: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-[var(--text-secondary)]">
                          <span className="text-[var(--accent)] text-2xl leading-none">→</span>
                          <span className="flex-1">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                </div>
              </div>
            </section>
          )}

          {/* Call to Action */}
          {sections.callToAction?.enabled && (
            <section className="bg-[var(--Secondary-Background)] py-20">
              <div className="container mx-auto px-6 max-w-4xl">
                <div className="bg-[var(--card)] rounded-xl shadow-2xl p-12 text-center pop-on-scroll">
                  <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                    {sections.callToAction.heading}
                  </h2>
                  <p className="text-lg text-[var(--text)] mb-8 font-secondary">
                    {sections.callToAction.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href={sections.callToAction.primaryButtonLink}
                      className="px-8 py-4 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-lg font-secondary"
                    >
                      {sections.callToAction.primaryButtonText}
                    </Link>
                  {sections.callToAction.secondaryButtonText && (
                    <Link
                      href={sections.callToAction.secondaryButtonLink || '#'}
                      className="btn btn-secondary"
                    >
                      {sections.callToAction.secondaryButtonText}
                    </Link>
                  )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </PageAnimator>
      <Footer />
    </>
  );
}
