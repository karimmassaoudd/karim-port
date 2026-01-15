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
          <div className="text-center mb-8 pop-on-scroll">
            <span className="inline-block px-4 py-2 bg-[var(--Secondary-Background)] text-[var(--accent)] rounded-lg text-sm font-semibold mb-4 font-secondary">
              {section.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-[var(--headline)] mb-4 font-primary leading-tight">
              {section.title}
            </h1>
            <p className="text-base md:text-xl text-[var(--text)] max-w-3xl mx-auto font-secondary leading-relaxed">
              {section.tagline}
            </p>
          </div>
          {section.heroImage?.url && (
            <div className="pop-on-scroll rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
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
          className="reveal-section relative w-full bg-[var(--Secondary-Background)] py-16 md:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="w-50 h-1 rounded-full bg-[var(--accent)] mb-3" />
              <h2 className="text-[var(--text)] font-primary text-4xl md:text-5xl leading-tight tracking-wide">
                OVERVIEW
              </h2>
            </div>
            <div className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="reveal-el rounded-2xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-[var(--Secondary-Background)]/70 shadow-sm hover:shadow-md transition p-5 md:p-6 flex items-start gap-3">
                    <div className="mt-0.5 rounded-md p-1.5 bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-wide text-[var(--secondary-text)] mb-1">
                        ROLE
                      </p>
                      <p className="text-[var(--text)] font-semibold">
                        {section.role || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="reveal-el rounded-2xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-[var(--Secondary-Background)]/70 shadow-sm hover:shadow-md transition p-5 md:p-6 flex items-start gap-3">
                    <div className="mt-0.5 rounded-md p-1.5 bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-wide text-[var(--secondary-text)] mb-1">
                        TYPE
                      </p>
                      <p className="text-[var(--text)] font-semibold">
                        {section.type || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="reveal-el rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[var(--Secondary-Background)]/70 shadow-sm hover:shadow-md transition p-5 md:p-6">
                  <p className="text-[11px] tracking-wide text-[var(--secondary-text)] mb-2">
                    HIGHLIGHTS
                  </p>
                  {section.highlights?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {section.highlights.map(
                        (highlight: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] md:text-sm bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)] shadow-sm transition transform hover:shadow-md hover:scale-[1.03]"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                              />
                            </svg>
                            {highlight}
                          </span>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="text-[var(--secondary-text)] text-sm">No highlights added</p>
                  )}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5">
                {section.image?.url ? (
                  <div className="relative group max-w-xl lg:ml-auto">
                    <div
                      className="absolute -inset-6 bg-[var(--accent)]/20 blur-3xl rounded-3xl opacity-0 group-hover:opacity-100 transition pointer-events-none"
                      aria-hidden="true"
                    />
                    <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl pop-on-scroll bg-[var(--background)]">
                      <div className="relative w-full aspect-[5/2] overflow-hidden">
                        <img
                          src={section.image.url}
                          alt={section.image.alt || "Project overview"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative max-w-xl lg:ml-auto">
                    <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[var(--Secondary-Background)]">
                      <div className="relative w-full aspect-[5/2] flex items-center justify-center">
                        <p className="text-[var(--secondary-text)]">No image uploaded</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );

    case "problemStatement":
      return (
        <section key="problemStatement" className="reveal-section py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="pop-on-scroll">
              <h2 className="text-4xl  text-[var(--headline)] mb-6 font-primary">
                {section.heading}
              </h2>
              <p className="text-base text-[var(--text)] leading-relaxed mb-8 font-secondary">
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
          className="reveal-section bg-[var(--Secondary-Background)] py-20"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="bg-[var(--card)] rounded-xl shadow-xl p-8 md:p-12 pop-on-scroll">
              <h2 className="text-4xl  text-[var(--headline)] mb-6 font-primary">
                {section.heading}
              </h2>
              <p className="text-base text-[var(--text)] leading-relaxed mb-8 font-secondary">
                {section.description}
              </p>
              {section.solutions?.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  {section.solutions.map((solution: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-[var(--Secondary-Background)] p-6 rounded-lg"
                    >
                      <h4 className="text-base font-semibold text-[var(--headline)] mb-3 font-primary">
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
              <h2 className="text-4xl  text-[var(--headline)] mb-4 font-primary">
                {section.heading}
              </h2>
              <p className="text-base text-[var(--text)] max-w-3xl mx-auto font-secondary">
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
              <h2 className="text-4xl  text-[var(--headline)] mb-4 font-primary">
                {section.heading}
              </h2>
              <p className="text-base text-[var(--text)] max-w-3xl mx-auto font-secondary">
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
              <h2 className="text-4xl  text-[var(--headline)] mb-4 font-primary">
                {section.heading}
              </h2>
              <p className="text-base text-[var(--text)] max-w-3xl mx-auto font-secondary">
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
              <h2 className="text-4xl  text-[var(--headline)] mb-6 text-center font-primary">
                {section.heading}
              </h2>
              <p className="text-base text-[var(--text)] text-center mb-12 max-w-3xl mx-auto font-secondary">
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
              <h2 className="text-4xl  text-[var(--headline)] mb-6 text-center font-primary">
                {section.heading}
              </h2>
              <p className="text-base text-[var(--text)] text-center mb-8 font-secondary">
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
              <h2 className="text-4xl  text-[var(--headline)] mb-6 font-primary">
                {section.heading}
              </h2>
              <p className="text-base text-[var(--text)] max-w-3xl mx-auto font-secondary">
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
                    <div className="text-5xl  text-[var(--accent)] mb-3 font-primary">
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
              <h2 className="text-4xl  text-[var(--headline)] mb-6 font-primary">
                {section.heading}
              </h2>
              <p className="text-base text-[var(--text)] leading-relaxed mb-8 font-secondary">
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

    case "hoverExploration":
      return (
        <section
          key="hoverExploration"
          className="reveal-section py-20 bg-[var(--background)]"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="mb-8 pop-on-scroll">
              {section.heading && (
                <>
                  <div className="w-24 h-1 rounded-full bg-[var(--accent)] mb-6" />
                  <h2 className="text-[var(--text)] font-primary text-3xl md:text-4xl mb-4">
                    {section.heading}
                  </h2>
                </>
              )}
              {section.description && (
                <p className="text-base text-[var(--secondary-text)] max-w-3xl font-secondary">
                  {section.description}
                </p>
              )}
            </div>

            {section.tiles?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.tiles.map((tile: any, idx: number) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-md bg-[var(--background)] pop-on-scroll"
                  >
                    {tile.image?.url && (
                      <div className="relative w-full aspect-[16/10]">
                        <img
                          src={tile.image.url}
                          alt={tile.image.alt || tile.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}

                    {/* hover veil */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    {/* content */}
                    <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                      <div>
                        {tile.subtitle && (
                          <p className="text-white/90 text-xs">{tile.subtitle}</p>
                        )}
                        {tile.title && (
                          <h3 className="text-white font-semibold text-base leading-tight">
                            {tile.title}
                          </h3>
                        )}
                      </div>
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-[var(--accent)]  shadow">
                        ↗
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.footerText && (
              <p className="text-[var(--secondary-text)] text-sm mt-6 pop-on-scroll">
                {section.footerText}
              </p>
            )}
          </div>
        </section>
      );

    case "quoteProcess":
      return (
        <section key="quoteProcess" className="reveal-section py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            {section.quote && (
              <div className="pop-on-scroll mb-12 text-center">
                <blockquote className="text-2xl md:text-3xl text-[var(--headline)] italic max-w-4xl mx-auto font-primary">
                  "{section.quote}"
                </blockquote>
              </div>
            )}
            {section.processCards && section.processCards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.processCards.map((card: any, idx: number) => (
                  <div
                    key={idx}
                    className="pop-on-scroll bg-[var(--card)] rounded-xl p-6 shadow-lg border border-[var(--border)]"
                  >
                    <h3 className="text-xl font-semibold text-[var(--headline)] mb-4 font-primary">
                      {card.title}
                    </h3>
                    <ul className="space-y-2">
                      {card.items?.map((item: string, itemIdx: number) => (
                        <li
                          key={itemIdx}
                          className="text-[var(--text)] flex items-start gap-2 font-secondary"
                        >
                          <span className="text-[var(--accent)] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "themes":
      return (
        <section
          key="themes"
          className="reveal-section bg-[var(--Secondary-Background)] py-20"
        >
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12 pop-on-scroll">
              <h2 className="text-4xl  text-[var(--headline)] mb-4 font-primary">
                {section.heading}
              </h2>
              {section.description && (
                <p className="text-base text-[var(--text)] max-w-3xl mx-auto font-secondary">
                  {section.description}
                </p>
              )}
            </div>
            {section.themes && section.themes.length > 0 && (
              <div className="space-y-16">
                {section.themes.map((theme: any, idx: number) => (
                  <div key={idx} className="pop-on-scroll">
                    <h3 className="text-2xl font-semibold text-[var(--headline)] mb-2 font-primary text-center">
                      {theme.title}
                    </h3>
                    {theme.images && theme.images.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {theme.images.slice(0, 3).map((img: any, imgIdx: number) => (
                          <div
                            key={imgIdx}
                            className="rounded-xl overflow-hidden shadow-lg"
                          >
                            <img
                              src={img.url}
                              alt={img.alt || theme.title}
                              className="w-full h-auto"
                            />
                            {img.caption && (
                              <p className="text-sm text-[var(--secondary-text)] mt-2 px-2 font-secondary">
                                {img.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "specialOffers":
      return (
        <section key="specialOffers" className="reveal-section py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12 pop-on-scroll">
              <h2 className="text-4xl  text-[var(--headline)] mb-4 font-primary">
                {section.heading}
              </h2>
              {section.description && (
                <p className="text-base text-[var(--text)] max-w-3xl mx-auto font-secondary">
                  {section.description}
                </p>
              )}
            </div>
            {section.offers && section.offers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.offers.map((offer: any, idx: number) => (
                  <div
                    key={idx}
                    className="pop-on-scroll bg-[var(--card)] rounded-xl p-6 shadow-lg border border-[var(--border)] hover:shadow-xl transition-shadow"
                  >
                    {offer.discountBadge && (
                      <span className="inline-block px-3 py-1 bg-[var(--accent)] text-white text-sm font-semibold rounded-full mb-4 font-secondary">
                        {offer.discountBadge}
                      </span>
                    )}
                    <h3 className="text-2xl font-semibold text-[var(--headline)] mb-2 font-primary">
                      {offer.title}
                    </h3>
                    {offer.subtitle && (
                      <p className="text-[var(--text)] text-sm mb-3 font-secondary">
                        {offer.subtitle}
                      </p>
                    )}
                    {offer.description && (
                      <p className="text-[var(--text)] mb-4 font-secondary">
                        {offer.description}
                      </p>
                    )}
                    <div className="flex items-baseline gap-3 mb-4">
                      {offer.originalPrice && (
                        <span className="text-[var(--text)] line-through text-base font-secondary">
                          {offer.originalPrice}
                        </span>
                      )}
                      {offer.discountedPrice && (
                        <span className="text-[var(--accent)] text-2xl  font-primary">
                          {offer.discountedPrice}
                        </span>
                      )}
                    </div>
                    {offer.buttonLink && offer.buttonText && (
                      <a
                        href={offer.buttonLink}
                        className="block w-full text-center px-6 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-lg font-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {offer.buttonText}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "callToAction":
      return (
        <section
          key="callToAction"
          className="reveal-section bg-[var(--Secondary-Background)] py-10"
        >
          <div className="container mx-auto px-6 max-w-xl">
            <div className="text-center pop-on-scroll space-y-4">
              <h2 className="text-2xl md:text-3xl text-[var(--headline)] font-primary">
                {section.heading}
              </h2>
              <p className="text-sm text-[var(--secondary-text)] font-secondary">
                {section.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                <Link
                  href={section.primaryButtonLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] transition-all shadow-md hover:shadow-lg font-secondary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  {section.primaryButtonText}
                </Link>
                {section.secondaryButtonText && (
                  <Link
                    href={section.secondaryButtonLink || "#"}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-[var(--text)] rounded-lg text-sm font-medium hover:bg-[var(--surface)] transition-all border border-[var(--border)] font-secondary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
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
