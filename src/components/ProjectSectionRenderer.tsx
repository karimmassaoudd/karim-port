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
        <section
          key="hero"
          className="relative w-full min-h-[75vh] flex items-center bg-[#070b12] overflow-hidden py-20"
        >
          {/* Subtle blue spotlight background effect */}
          <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[60%] h-[70%] bg-[#1a365d] opacity-50 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col lg:flex-row items-center justify-center gap-30 lg:gap-40">
            {/* Left side: Text Content */}
            <div className="w-full lg:w-auto text-center lg:text-left pop-on-scroll">
              <div className="inline-block relative mb-6">
                <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] text-white font-primary tracking-wide leading-tight lg:-ml-1 pb-1">
                  {section.title}
                </h1>
                {/* Thin blue underline matching the design */}
                <div className="w-full h-[2px] bg-[#1a5a98] mt-3 opacity-90 shadow-[0_0_15px_rgba(26,90,152,0.5)]" />
              </div>

              <p className="text-base md:text-lg xl:text-xl text-[#a0acb9] font-secondary leading-relaxed max-w-sm mx-auto lg:mx-0 font-light mt-2">
                {section.tagline}
              </p>
            </div>

            {/* Right side: Laptop Mockup */}
            {section.heroImage?.url && (
              <div className="w-full lg:w-auto flex justify-center pop-on-scroll">
                {/* Laptop Container Wrapper */}
                <div className="relative w-full max-w-[380px] lg:max-w-[420px] perspective-1000 mt-[2vh]">
                  {/* Laptop Screen Bezel */}
                  <div className="relative w-full aspect-[16/10] bg-[#121212] rounded-t-xl rounded-b-sm border-2 border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1.5 md:p-2">
                    {/* Screen Content Wrapper */}
                    <div className="relative w-full h-full bg-black overflow-hidden rounded-sm ring-1 ring-white/10">
                      <img
                        src={section.heroImage.url}
                        alt={section.heroImage.alt || section.title}
                        className="w-full h-full object-cover object-top"
                      />
                      {/* Subtle screen glare */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Laptop Base (Keyboard area) */}
                  <div className="relative w-[110%] -ml-[5%] h-4 md:h-5 bg-gradient-to-b from-gray-400 to-gray-600 rounded-b-2xl shadow-xl flex justify-center border-t border-gray-300 relative z-10 box-border">
                    {/* Trackpad Indent */}
                    <div className="w-1/4 h-2 bg-gray-500 rounded-b-md shadow-inner mt-[1px]" />
                  </div>

                  {/* Laptop Shadow Drop */}
                  <div className="absolute -bottom-6 w-[120%] -ml-[10%] h-6 bg-black blur-xl opacity-50 rounded-full z-0" />
                </div>
              </div>
            )}
          </div>
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
                    <p className="text-[var(--secondary-text)] text-sm">
                      No highlights added
                    </p>
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
                        <p className="text-[var(--secondary-text)]">
                          No image uploaded
                        </p>
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
      const overviewSection = project.sections?.overview || {};
      const firstGalleryImage = section.images?.[0]?.url;

      return (
        <section key="problemStatement" className="reveal-section py-20 bg-[#070b12] overflow-hidden">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20">

              {/* Left Side: Large Visual Image */}
              <div className="flex-1 lg:w-1/2 reveal-el">
                {firstGalleryImage ? (
                  <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                    <img
                      src={firstGalleryImage}
                      alt={section.heading || "Challenge Image"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[400px] bg-[var(--Secondary-Background)] rounded-3xl flex items-center justify-center border border-dashed border-white/10">
                    <p className="text-[var(--secondary-text)]">No image available</p>
                  </div>
                )}
              </div>

              {/* Right Side: Project Summary Card */}
              <div className="flex-1 lg:w-1/2 flex items-center reveal-el">
                <div className="w-full bg-[#0a0f18]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative group">
                  {/* Subtle top-left highlight */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--accent)]/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                  <div className="relative z-10 space-y-8">
                    <div>
                      <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-[var(--secondary-text)] uppercase mb-3 opacity-60">
                        Project Summary
                      </p>
                      <h2 className="text-3xl md:text-4xl xl:text-5xl text-white font-primary tracking-wide leading-tight uppercase">
                        {section.heading || "The Challenge"}
                      </h2>
                      <div className="w-20 h-[2px] bg-[var(--accent)] mt-4 shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]" />
                    </div>

                    <p className="text-sm md:text-base text-[#a0acb9] font-secondary leading-relaxed font-light">
                      {section.description}
                    </p>

                    {/* Metadata Grid (Role, Type, Highlights) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[10px] tracking-widest text-[#a0acb9]/60 font-semibold mb-1 uppercase">Role</p>
                        <p className="text-sm text-white font-secondary">{overviewSection.role || "Designer & Developer"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-widest text-[#a0acb9]/60 font-semibold mb-1 uppercase">Type</p>
                        <p className="text-sm text-white font-secondary">{overviewSection.type || "Web Application"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-[10px] tracking-widest text-[#a0acb9]/60 font-semibold mb-1 uppercase">Highlights</p>
                        <p className="text-sm text-white font-secondary leading-relaxed">
                          {overviewSection.highlights?.join(", ") || "Innovative design, Custom CMS"}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-8 py-3.5 bg-[var(--accent)] text-white rounded-xl text-sm font-bold tracking-wide hover:bg-[#144880] transition-all duration-300 shadow-[0_10px_20px_rgba(var(--accent-rgb),0.2)] hover:shadow-[0_15px_25px_rgba(var(--accent-rgb),0.3)] hover:-translate-y-1"
                        >
                          <MdOpenInNew size={20} />
                          OPEN LIVE DEMO
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

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
      const overviewData = project.sections.overview || {};

      return (
        <section
          key="hoverExploration"
          className="reveal-section relative w-full bg-[var(--Secondary-Background)] py-16 md:py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 pop-on-scroll">
              <div className="w-16 h-1 rounded-full bg-[var(--accent)] mb-3" />
              <h2 className="text-[var(--text)] font-primary text-4xl md:text-5xl leading-tight tracking-wide">
                OVERVIEW
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-8 items-stretch">
              {/* Left Column - Role, Type, Highlights */}
              <div className="col-span-12 lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="reveal-el rounded-2xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-[var(--Secondary-Background)]/70 shadow-sm transition p-5 md:p-6 flex items-start gap-3 h-full">
                      <div className="mt-0.5 rounded-md p-1.5 bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--accent)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11px] tracking-wide text-[var(--secondary-text)] mb-1 uppercase font-semibold">
                          ROLE
                        </p>
                        <p className="text-[var(--text)] font-medium leading-snug">
                          {overviewData.role || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="reveal-el rounded-2xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-[var(--Secondary-Background)]/70 shadow-sm transition p-5 md:p-6 flex items-start gap-3 h-full">
                      <div className="mt-0.5 rounded-md p-1.5 bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--accent)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11px] tracking-wide text-[var(--secondary-text)] mb-1 uppercase font-semibold">
                          TYPE
                        </p>
                        <p className="text-[var(--text)] font-medium leading-snug">
                          {overviewData.type || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="reveal-el rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[var(--Secondary-Background)]/70 shadow-sm transition p-5 md:p-6 h-full flex flex-col">
                    <p className="text-[11px] tracking-wide text-[var(--secondary-text)] mb-3 uppercase font-semibold">
                      HIGHLIGHTS
                    </p>
                    {overviewData.highlights?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {overviewData.highlights.map((highlight: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] bg-[var(--background)] border border-black/10 dark:border-white/10 text-[var(--text)] shadow-sm transition-transform hover:scale-105"
                          >
                            <span className="text-[var(--accent)]">#</span>
                            {highlight}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[var(--secondary-text)] text-sm">No highlights added</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - What We Offer Grid (Tiles) */}
              <div className="col-span-12 lg:col-span-5 flex">
                <div className="w-full rounded-3xl overflow-hidden shadow-2xl pop-on-scroll bg-[#002855] text-white p-6 md:p-8 border border-white/5 relative flex flex-col">
                  {/* Subtle background glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                  <div className="text-center mb-6 relative z-10">
                    <h3 className="text-lg font-bold font-secondary tracking-wide">{section.heading || "What We Offer"}</h3>
                  </div>

                  {section.tiles?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 flex-grow relative z-10">
                      {section.tiles.map((tile: any, idx: number) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                          {tile.image?.url ? (
                            <img
                              src={tile.image.url}
                              alt={tile.title}
                              className="h-12 w-12 mb-3 object-contain"
                            />
                          ) : (
                            <div className="h-12 w-12 mb-3 bg-white/10 rounded-full flex items-center justify-center">
                              <span className="w-6 h-1 bg-white/40 rounded-full"></span>
                            </div>
                          )}
                          <h4 className="text-[13px] font-semibold mb-2 font-secondary tracking-wide text-white/95 leading-tight min-h-[2.5rem] flex items-end justify-center">{tile.title}</h4>
                          <p className="text-[11px] text-[#86a8cc] leading-relaxed mb-4 flex-grow px-1">
                            {tile.subtitle}
                          </p>
                          <button className="mt-auto px-4 py-1.5 border border-[#4a729c] rounded-sm text-[9px] font-semibold tracking-widest uppercase hover:bg-white hover:text-[#002855] transition-all bg-transparent w-[100px]">
                            LEARN MORE
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-white/50 text-sm">
                      <p>Add tiles in the admin dashboard</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {section.description && (
              <p className="text-[var(--secondary-text)] text-sm mt-8 pop-on-scroll max-w-3xl">
                {section.description}
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
                        {theme.images
                          .slice(0, 3)
                          .map((img: any, imgIdx: number) => (
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  {section.primaryButtonText}
                </Link>
                {section.secondaryButtonText && (
                  <Link
                    href={section.secondaryButtonLink || "#"}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-[var(--text)] rounded-lg text-sm font-medium hover:bg-[var(--surface)] transition-all border border-[var(--border)] font-secondary"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                      />
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
