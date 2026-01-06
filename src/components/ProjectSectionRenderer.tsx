import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";
import ImageCarouselWithLightbox from "./ImageCarouselWithLightbox";

interface SectionRendererProps {
  sectionKey: string;
  section: any;
  project: any;
}

export function renderProjectSection({
  sectionKey,
  section,
  project,
}: SectionRendererProps) {
  if (!section?.enabled) return null;

  switch (sectionKey) {
    case "hero":
      return (
        <section key="hero" className="container mx-auto px-6 pb-16 max-w-6xl">
          <div className="text-center mb-12 pop-on-scroll">
            <span className="inline-block px-4 py-2 bg-[var(--Secondary-Background)] text-[var(--accent)] rounded-lg text-sm font-semibold mb-6 font-secondary">
              {section.category}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--headline)] mb-6 font-primary leading-tight">
              {section.title}
            </h1>
            <p className="text-xl md:text-2xl text-[var(--text)] max-w-3xl mx-auto font-secondary leading-relaxed">
              {section.tagline}
            </p>
          </div>
          {section.heroImage?.url && (
            <div className="pop-on-scroll rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={section.heroImage.url}
                alt={section.heroImage.alt}
                className="w-full h-auto"
              />
              {section.heroImage.caption && (
                <p className="text-center text-sm text-[var(--secondary-text)] mt-4 font-secondary">
                  {section.heroImage.caption}
                </p>
              )}
            </div>
          )}
        </section>
      );

    case "overview":
      return (
        <section
          key="overview"
          className="bg-[var(--Secondary-Background)] py-20"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8 pop-on-scroll">
                <div>
                  <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                    Overview
                  </h2>
                  <p className="text-lg text-[var(--text)] leading-relaxed font-secondary">
                    {section.description}
                  </p>
                </div>
                {section.keyFeatures?.length > 0 && (
                  <div className="bg-[var(--card)] rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-[var(--headline)] mb-4 font-primary">
                      Key Features
                    </h3>
                    <ul className="space-y-3">
                      {section.keyFeatures.map(
                        (feature: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-[var(--text)] font-secondary"
                          >
                            <span className="text-[var(--accent)] mt-1 flex-shrink-0">
                              →
                            </span>
                            <span>{feature}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-6 pop-on-scroll">
                <div className="bg-[var(--card)] rounded-xl p-8 shadow-lg space-y-6">
                  {section.client && (
                    <div className="group">
                      <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                        Client
                      </h4>
                      <p className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {section.client}
                      </p>
                    </div>
                  )}
                  {section.timeline && (
                    <div className="group">
                      <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                        Timeline
                      </h4>
                      <p className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {section.timeline}
                      </p>
                    </div>
                  )}
                  {section.role && (
                    <div className="group">
                      <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                        Role
                      </h4>
                      <p className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {section.role}
                      </p>
                    </div>
                  )}
                  {section.team && (
                    <div className="group">
                      <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                        Team
                      </h4>
                      <p className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {section.team}
                      </p>
                    </div>
                  )}
                  {project.technologies?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map(
                          (tech: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/5 text-[var(--accent)] rounded-xl text-sm font-semibold border border-[var(--accent)]/20 hover:border-[var(--accent)]/40 hover:shadow-lg hover:shadow-[var(--accent)]/10 transition-all duration-200"
                            >
                              {tech}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subsections with Images */}
            {section.subsections && section.subsections.length > 0 && (
              <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.subsections.map((subsection: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[var(--card)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow pop-on-scroll"
                  >
                    {subsection.image?.url && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={subsection.image.url}
                          alt={subsection.image.alt || subsection.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                        {subsection.title}
                      </h3>
                      <p className="text-[var(--text)] leading-relaxed font-secondary">
                        {subsection.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "problemStatement":
      return (
        <section key="problemStatement" className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="pop-on-scroll">
              <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                {section.heading}
              </h2>
              <p className="text-lg text-[var(--text)] leading-relaxed mb-8 font-secondary">
                {section.description}
              </p>

              {/* Image Gallery Carousel */}
              {section.images && section.images.length > 0 && (
                <ImageCarouselWithLightbox
                  images={section.images}
                  maxVisible={3}
                />
              )}
            </div>
          </div>
        </section>
      );

    case "solutions":
      return (
        <section
          key="solutions"
          className="bg-[var(--Secondary-Background)] py-20"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="bg-[var(--card)] rounded-xl shadow-xl p-8 md:p-12 pop-on-scroll">
              <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                {section.heading}
              </h2>
              <p className="text-lg text-[var(--text)] leading-relaxed mb-8 font-secondary">
                {section.description}
              </p>
              {section.solutions?.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  {section.solutions.map((solution: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-[var(--Secondary-Background)] p-6 rounded-lg"
                    >
                      <h4 className="text-lg font-semibold text-[var(--headline)] mb-3 font-primary">
                        {solution.title}
                      </h4>
                      <p className="text-[var(--text)] font-secondary">
                        {solution.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case "branding":
      return (
        <section key="branding" className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12 pop-on-scroll">
              <h2 className="text-4xl font-bold text-[var(--headline)] mb-4 font-primary">
                {section.heading}
              </h2>
              <p className="text-lg text-[var(--text)] max-w-3xl mx-auto font-secondary">
                {section.description}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {section.logo?.url && (
                <div className="bg-[var(--card)] rounded-xl shadow-xl p-12 flex items-center justify-center pop-on-scroll">
                  <img
                    src={section.logo.url}
                    alt={section.logo.alt}
                    className="max-w-full h-auto max-h-64 object-contain"
                  />
                </div>
              )}

              <div className="space-y-6 pop-on-scroll">
                {section.colorPalette && (
                  <div className="bg-[var(--card)] rounded-xl shadow-xl p-6">
                    <h3 className="text-xl font-semibold text-[var(--headline)] mb-4 font-primary">
                      Color Palette
                    </h3>
                    <div className="flex gap-4">
                      {section.colorPalette.primary && (
                        <div className="flex-1">
                          <div
                            className="w-full h-24 rounded-lg shadow-lg mb-2"
                            style={{
                              backgroundColor: section.colorPalette.primary,
                            }}
                          />
                          <p className="text-sm text-[var(--secondary-text)] text-center font-secondary">
                            {section.colorPalette.primary}
                          </p>
                        </div>
                      )}
                      {section.colorPalette.secondary && (
                        <div className="flex-1">
                          <div
                            className="w-full h-24 rounded-lg shadow-lg mb-2"
                            style={{
                              backgroundColor: section.colorPalette.secondary,
                            }}
                          />
                          <p className="text-sm text-[var(--text-secondary)] text-center">
                            {section.colorPalette.secondary}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {section.typography && (
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--text)] mb-4">
                      Typography
                    </h3>
                    <div className="space-y-2">
                      {section.typography.primary && (
                        <p className="text-[var(--text-secondary)]">
                          <span className="font-medium text-[var(--text)]">
                            Primary:
                          </span>{" "}
                          {section.typography.primary}
                        </p>
                      )}
                      {section.typography.secondary && (
                        <p className="text-[var(--text-secondary)]">
                          <span className="font-medium text-[var(--text)]">
                            Secondary:
                          </span>{" "}
                          {section.typography.secondary}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );

    case "wireframes":
      return (
        <section key="wireframes" className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12 pop-on-scroll">
              <h2 className="text-4xl font-bold text-[var(--headline)] mb-4 font-primary">
                {section.heading}
              </h2>
              <p className="text-lg text-[var(--text)] max-w-3xl mx-auto font-secondary">
                {section.description}
              </p>
            </div>
            {section.wireframes?.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8">
                {section.wireframes.map((image: any, idx: number) => (
                  <div
                    key={idx}
                    className="pop-on-scroll rounded-xl overflow-hidden shadow-xl bg-[var(--card)]"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-auto"
                    />
                    {image.alt && (
                      <p className="text-sm text-[var(--secondary-text)] mt-3 text-center px-4 pb-4 font-secondary">
                        {image.alt}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "uiuxDesign":
      return (
        <section
          key="uiuxDesign"
          className="bg-[var(--Secondary-Background)] py-20"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12 pop-on-scroll">
              <h2 className="text-4xl font-bold text-[var(--headline)] mb-4 font-primary">
                {section.heading}
              </h2>
              <p className="text-lg text-[var(--text)] max-w-3xl mx-auto font-secondary">
                {section.description}
              </p>
            </div>
            {section.mockups?.length > 0 && (
              <div className="space-y-8">
                {section.mockups.map((mockup: any, idx: number) => (
                  <div
                    key={idx}
                    className="pop-on-scroll rounded-xl overflow-hidden shadow-2xl bg-[var(--card)]"
                  >
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
      );

    case "developmentProcess":
      return (
        <section
          key="developmentProcess"
          className="bg-[var(--Secondary-Background)] py-20"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="bg-[var(--card)] rounded-xl shadow-xl p-8 md:p-12 pop-on-scroll">
              <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 text-center font-primary">
                {section.heading}
              </h2>
              <p className="text-lg text-[var(--text)] text-center mb-12 max-w-3xl mx-auto font-secondary">
                {section.description}
              </p>
              {section.techStack?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[var(--headline)] mb-6 text-center font-primary">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {section.techStack.map((tech: string, idx: number) => (
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
      );

    case "websitePreview":
      return (
        <section key="websitePreview" className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="bg-[var(--card)] rounded-xl shadow-xl p-8 md:p-12 pop-on-scroll">
              <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 text-center font-primary">
                {section.heading}
              </h2>
              <p className="text-lg text-[var(--text)] text-center mb-8 font-secondary">
                {section.description}
              </p>
              <div className="flex justify-center gap-4 mb-8">
                {section.liveUrl && (
                  <a
                    href={section.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <MdOpenInNew size={20} />
                    View Live Site
                  </a>
                )}
                {section.githubUrl && (
                  <a
                    href={section.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <FaGithub size={20} />
                    View Code
                  </a>
                )}
              </div>
              {section.screenshots?.map((screenshot: any, idx: number) => (
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
      );

    case "resultsImpact":
      return (
        <section
          key="resultsImpact"
          className="bg-[var(--Secondary-Background)] py-20"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12 pop-on-scroll">
              <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                {section.heading}
              </h2>
              <p className="text-lg text-[var(--text)] max-w-3xl mx-auto font-secondary">
                {section.description}
              </p>
            </div>
            {section.metrics?.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
                {section.metrics.map((metric: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[var(--card)] text-center p-8 rounded-xl shadow-xl pop-on-scroll"
                  >
                    <div className="text-5xl font-bold text-[var(--accent)] mb-3 font-primary">
                      {metric.value}
                    </div>
                    <p className="text-[var(--text)] font-semibold font-secondary">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "conclusion":
      return (
        <section key="conclusion" className="py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="bg-[var(--card)] rounded-xl shadow-xl p-8 md:p-12 pop-on-scroll">
              <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                {section.heading}
              </h2>
              <p className="text-lg text-[var(--text)] leading-relaxed mb-8 font-secondary">
                {section.description}
              </p>
              {section.lessonsLearned?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text)] mb-4">
                    Key Takeaways
                  </h3>
                  <ul className="space-y-3">
                    {section.lessonsLearned.map(
                      (lesson: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-[var(--text-secondary)]"
                        >
                          <span className="text-[var(--accent)] text-2xl leading-none">
                            •
                          </span>
                          <span className="flex-1">{lesson}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
              {section.futureImprovements?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-[var(--text)] mb-4">
                    Future Improvements
                  </h3>
                  <ul className="space-y-3">
                    {section.futureImprovements.map(
                      (improvement: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-[var(--text-secondary)]"
                        >
                          <span className="text-[var(--accent)] text-2xl leading-none">
                            →
                          </span>
                          <span className="flex-1">{improvement}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case "callToAction":
      return (
        <section
          key="callToAction"
          className="bg-[var(--Secondary-Background)] py-20"
        >
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-[var(--card)] rounded-xl shadow-2xl p-12 text-center pop-on-scroll">
              <h2 className="text-4xl font-bold text-[var(--headline)] mb-6 font-primary">
                {section.heading}
              </h2>
              <p className="text-lg text-[var(--text)] mb-8 font-secondary">
                {section.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={section.primaryButtonLink}
                  className="px-8 py-4 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-lg font-secondary"
                >
                  {section.primaryButtonText}
                </Link>
                {section.secondaryButtonText && (
                  <Link
                    href={section.secondaryButtonLink || "#"}
                    className="btn btn-secondary"
                  >
                    {section.secondaryButtonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}
