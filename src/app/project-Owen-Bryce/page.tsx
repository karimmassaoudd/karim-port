"use client";

import { ChevronDown, GripVertical, Power } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageAnimator from "@/components/PageAnimator";
import SectionBackground from "@/components/SectionBackground";

export default function OwenBrycePage() {
  const [activeTab, setActiveTab] = useState<
    "instagram" | "quotes" | "spotify" | "feedbacks"
  >("instagram");

  // Animations are initialized once at the page level via PageAnimator wrapper

  // Mini projects gallery data (used at the very end of the page)
  const _projects = [
    {
      name: "Travel World",
      description:
        "A simple, friendly travel website that makes exploring destinations feel fun and effortless.",
      image: "/assets/Travel World Project Background .png",
      liveLink: "https://travel-website-complete-w0th.onrender.com/index.html",
      detailsLink: "/project-details",
    },
    {
      name: "Triple WAVE",
      description:
        "A friendly guide for international students in Eindhoven find housing, get around, manage finances, and discover local events.",
      image: "/assets/Eindhoven Project Background 2.jpg",
      liveLink: "https://triple-wave.netlify.app/",
      detailsLink: "/project-details",
    },
    {
      name: "Owen Bryce",
      description:
        " A comprehensive promotional campaign for an emerging folk/indie artist, creating a cohesive brand identity across multiple platforms",
      image: "/assets/Owen Bryce Project Background .png",
      liveLink:
        "https://karimmassaoudd-portfolio-lastversion.netlify.app/html%20files/branding",
      detailsLink: "/project-Owen-Bryce",
    },
  ] as const;

  return (
    <>
      <Header />
      <PageAnimator>
        <main className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="reveal-section relative min-h-[90vh] md:min-h-screen overflow-hidden">
          <SectionBackground />
          {/* Background image */}
          <Image
            src="/assets/Owne bryce pic1.png"
            alt="Close-up microphone with bokeh lights in background"
            fill
            priority
            className="object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center min-h-[90vh] md:min-h-screen">
            {/* Badge */}
            <span className="reveal-el inline-block bg-[#FFD24D] text-black text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full shadow-md mb-5">
              EP Promotion Project
            </span>

            {/* Title */}
            <h1 className="reveal-el text-white font-primary text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Owen Bryce
            </h1>

            {/* Subtitle */}
            <p className="reveal-el mt-4 max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed">
              A comprehensive promotional campaign for an emerging folk/indie
              artist, creating a cohesive brand identity across multiple
              platforms
            </p>

            {/* CTA */}
            <Link
              href="#content"
              className="reveal-el mt-8 inline-flex items-center justify-center px-6 py-3 rounded-md bg-[var(--accent)] text-white text-sm font-semibold tracking-wide shadow hover:opacity-90 transition"
            >
              Explore the Project
            </Link>

            {/* Down arrow cue */}
            <div className="scroll-cue text-[var(--accent)]" aria-hidden="true">
              <ChevronDown className="scroll-cue__icon" />
            </div>
          </div>
        </section>

        {/* Project Overview */}
        <section
          id="content"
          className="reveal-section relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[var(--Secondary-Background)] pt-8 md:pt-10 pb-16 md:pb-20"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-4 md:mt-6 relative lg:pl-0 mb-10 md:mb-14 text-left">
              <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute left-[-290px] -top-6 -rotate-90 select-none pointer-events-none">
                02
              </div>
              <h2 className="reveal-el font-primary text-3xl sm:text-4xl font-bold text-[var(--text)]">
                Project Overview
              </h2>
              <div className="reveal-el h-1 w-16 bg-[var(--accent)] rounded mt-3 mb-8" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Overview image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl shadow-lg bg-black/5">
                <Image
                  src="/assets/owen bryce4.png"
                  alt="Owen Bryce microphone and lights"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Overview text */}
              <div>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  The project focused on creating a comprehensive promotional
                  strategy for Owen Bryce, an emerging folk/indie artist
                  preparing to release his debut EP. Our goal was to develop a
                  cohesive brand identity and promotional campaign across
                  multiple platforms to maximize audience reach and engagement.
                </p>

                <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                      Client
                    </dt>
                    <dd className="text-[var(--foreground)] font-medium">
                      Owen Bryce
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                      Role
                    </dt>
                    <dd className="text-[var(--foreground)] font-medium">
                      Marketing Strategist / Producer / Designer
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                      Timeline
                    </dt>
                    <dd className="text-[var(--foreground)] font-medium">
                      8 weeks
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                      Platforms
                    </dt>
                    <dd className="text-[var(--foreground)] font-medium">
                      Instagram, Spotify, TikTok, Print Media
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* The Challenge & Our Strategy */}
        <section className="reveal-section relative py-10 md:py-16 bg-[var(--Secondary-Background)]">
          {/* Rotated section number 03 */}
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute right-0 top-10 -rotate-90 select-none pointer-events-none">
            03
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md p-6 md:p-8">
              <h3 className="font-primary text-xl sm:text-2xl font-semibold text-[var(--foreground)]">
                The Challenge
              </h3>
              <p className="mt-3 text-[var(--muted-foreground)] text-sm leading-relaxed">
                Owen Bryce, a talented folk/indie artist, needed to establish
                his brand identity and promote his debut EP in a crowded music
                market. With limited resources and recognition, he faced the
                challenge of standing out and connecting with his target
                audience across multiple platforms.
              </p>
              <ul className="mt-4 space-y-2 text-[var(--foreground)] text-sm list-disc pl-5">
                <li>Establishing a distinctive brand identity</li>
                <li>Creating cohesive content across platforms</li>
                <li>Reaching the right audience for his genre</li>
                <li>Maximizing impact with limited resources</li>
                <li>Building a foundation for long-term growth</li>
              </ul>
            </div>

            <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md p-6 md:p-8">
              <h3 className="font-primary text-xl sm:text-2xl font-semibold text-[var(--foreground)]">
                Our Strategy
              </h3>
              <p className="mt-3 text-[var(--muted-foreground)] text-sm leading-relaxed">
                We developed a multi-platform strategy centered around authentic
                storytelling and visual consistency. By focusing on Owen’s
                unique artistic voice and creating a cohesive visual language,
                we built a promotional campaign that resonated with his target
                audience.
              </p>
              <ul className="mt-4 space-y-2 text-[var(--foreground)] text-sm list-disc pl-5">
                <li>
                  Develop a comprehensive brand guide with consistent visual
                  elements
                </li>
                <li>
                  Create platform-specific content optimized for each channel
                </li>
                <li>
                  Implement a coordinated release schedule across platforms
                </li>
                <li>
                  Leverage authentic storytelling to build emotional connection
                </li>
                <li>Design shareable assets to maximize organic reach</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Project Components (Tabs) */}
        <section className="reveal-section relative pt-12 md:pt-20 pb-0">
          {/* Rotated section number 04 */}
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute left-0 top-6 -rotate-90 select-none pointer-events-none">
            04
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="reveal-el font-primary text-3xl sm:text-4xl font-bold text-[var(--text)]">
              Project Components
            </h2>
            <div className="reveal-el h-1 w-16 bg-[var(--accent)] rounded mt-3" />

            {/* Tabs */}
            <div className="mt-6 border-b border-black/10 overflow-x-auto">
              <div className="flex gap-6 text-sm">
                {[
                  { key: "instagram", label: "Instagram" },
                  { key: "quotes", label: "Quotes & Posters" },
                  { key: "spotify", label: "Spotify" },
                  { key: "feedbacks", label: "Feedbacks" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key as typeof activeTab)}
                    className={`relative py-3 -mb-px whitespace-nowrap ${
                      activeTab === t.key
                        ? "text-[var(--foreground)] font-semibold border-b-2 border-[var(--accent)]"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Panels */}
            <div className="mt-10 space-y-12">
              {activeTab === "instagram" && (
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6">
                    <h3 className="font-primary text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">
                      Instagram Strategy & Content Management
                    </h3>
                    <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed">
                      We developed a comprehensive Instagram strategy to build
                      Owen’s following and create anticipation for his EP
                      release. The approach focused on consistent visual
                      aesthetics, authentic storytelling, and strategic content
                      scheduling.
                    </p>
                    <h4 className="mt-6 font-semibold text-[var(--foreground)]">
                      Key Deliverables:
                    </h4>
                    <ul className="mt-3 space-y-2 list-disc pl-5 text-sm">
                      <li>
                        Weekly content calendar with consistent posting schedule
                      </li>
                      <li>Short reels previewing new songs</li>
                      <li>Behind-the-scenes studio sessions</li>
                      <li>Interactive story polls and Q&A sessions</li>
                      <li>
                        Highlights for music releases, concerts, and fan
                        interactions
                      </li>
                    </ul>
                  </div>
                  <div className="lg:col-span-6">
                    <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/assets/Instagram Owen Bryce .png"
                        alt="Instagram preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "quotes" && (
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6 order-2 lg:order-1">
                    <h3 className="font-primary text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">
                      Inspirational Quotes & Artist Promotion
                    </h3>
                    <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed">
                      To amplify Owen Bryce’s artistic message and increase
                      engagement, we curated authentic quotes and analyzed
                      effective promotional methods from established artists in
                      the indie/folk scene.
                    </p>
                    <h4 className="mt-6 font-semibold text-[var(--foreground)]">
                      Key Deliverables:
                    </h4>
                    <ul className="mt-3 space-y-2 list-disc pl-5 text-sm">
                      <li>Authentic quote collection aligned with the brand</li>
                      <li>
                        Visually consistent quote graphics optimized for
                        Instagram
                      </li>
                      <li>
                        Research on techniques from leading artists and
                        campaigns
                      </li>
                      <li>Teaser campaigns and social countdowns</li>
                      <li>
                        Fan connection tactics like Q&As and behind-the-scenes
                        glimpses
                      </li>
                    </ul>
                  </div>
                  <div className="lg:col-span-6 order-1 lg:order-2">
                    <div className="relative w-full aspect-[16/12] rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/assets/Inspiration Owen Bryce .png"
                        alt="Quotes and posters collage"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "spotify" && (
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6">
                    <h3 className="font-primary text-2xl sm:text-3xl font-semibold text-[var(--foreground)]">
                      Spotify Branding & TikTok Strategy
                    </h3>
                    <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed">
                      We designed a cohesive visual branding for Bryce’s EP
                      cover suitable for Spotify and developed an engaging
                      TikTok promotion strategy to reach new audiences.
                    </p>
                    <h4 className="mt-6 font-semibold text-[var(--foreground)]">
                      Key Deliverables:
                    </h4>
                    <ul className="mt-3 space-y-2 list-disc pl-5 text-sm">
                      <li>
                        Professional EP cover following Spotify guidelines
                      </li>
                      <li>
                        Minimalist design with strong visual impact
                        (3000x3000px)
                      </li>
                      <li>
                        Clear typography featuring EP title and artist name
                      </li>
                      <li>TikTok campaign with short, engaging teasers</li>
                      <li>Behind-the-scenes footage of EP creation</li>
                      <li>Regular posting schedule for maximum reach</li>
                    </ul>
                  </div>
                  <div className="lg:col-span-6">
                    <div className="rounded-xl overflow-hidden shadow-lg bg-black/5">
                      <iframe
                        title="Spotify playlist"
                        src="https://open.spotify.com/embed/artist/3IdIvobX95JU1jBjlYML9h?utm_source=generator"
                        width="100%"
                        height="380"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="w-full h-[380px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "feedbacks" && (
                <div className="space-y-6">
                  <div className="bg-[var(--card)] rounded-xl shadow-md p-6">
                    <h4 className="font-semibold text-[var(--foreground)]">
                      Checkpoint 8 — Feedback Pim and Jo-An in class
                    </h4>
                    <p className="mt-3 text-[var(--muted-foreground)] text-sm leading-relaxed">
                      We talked with our teacher about what we’ve been doing
                      over the last few weeks. We showed the brand guide and the
                      logos we made, explaining our ideas and choices. Our
                      teacher gave helpful advice and told us how to present
                      everything clearly this Friday. This way, we can impress
                      Owen Bryce and have him choose our work for his product.
                    </p>
                  </div>
                  <div className="bg-[var(--card)] rounded-xl shadow-md p-6">
                    <h4 className="font-semibold text-[var(--foreground)]">
                      Checkpoint 3 — Standup Josh & Maikel
                    </h4>
                    <p className="mt-3 text-[var(--muted-foreground)] text-sm leading-relaxed">
                      Today, we talked with our teacher about our progress. He
                      asked us some questions about our logo, and we showed him
                      the one Owen Bryce chose. He told us to focus more on his
                      design and make sure it matches the same style and font.
                      We also asked about the website design we’re making for
                      him. He said we need to understand what style and colours
                      he likes so he can see how our work fits his vision.
                    </p>
                  </div>
                </div>
              )}

              {/* Visual Assets */}
              <section className="reveal-section relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-12 md:py-20 bg-[var(--Secondary-Background)]">
                {/* Rotated section number 05 */}
                <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] dark:text-white/25 absolute right-4 top-10 -rotate-90 select-none pointer-events-none">
                  05
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="font-primary text-3xl sm:text-4xl font-bold text-[var(--text)]">
                    Visual Assets
                  </h2>
                  <div className="h-1 w-16 bg-[var(--accent)] rounded mt-3 mb-8" />

                  <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1 */}
                    <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md overflow-hidden">
                      <div className="relative w-full aspect-[13/10]">
                        <Image
                          src="/assets/EP Cover Owen Bryce .png"
                          alt="EP Cover Art preview"
                          fill
                          quality={90}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-[var(--foreground)]">
                          EP Cover Art
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          Minimalist design with strong visual impact, featuring
                          clear typography and natural elements.
                        </p>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md overflow-hidden">
                      <div className="relative w-full aspect-[13/10]">
                        <Image
                          src="/assets/Logo Owen Bryce .png"
                          alt="Logo variations preview"
                          fill
                          quality={90}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-[var(--foreground)]">
                          Logo Variations
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          Consistent logo system with variations for different
                          applications and backgrounds.
                        </p>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md overflow-hidden">
                      <div className="relative w-full aspect-[13/10]">
                        <Image
                          src="/assets/Social Media Owen Bcryce .png"
                          alt="Social media templates preview"
                          fill
                          quality={90}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-[var(--foreground)]">
                          Social Media Templates
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          Customizable templates for consistent posting across
                          Instagram, TikTok, and other platforms.
                        </p>
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md overflow-hidden">
                      <div className="relative w-full aspect-[13/10] bg-black/5">
                        <Image
                          src="/assets/Posters Owen Bryce .png"
                          alt="Promotional materials preview"
                          fill
                          quality={90}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-[var(--foreground)]">
                          Promotional Materials
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          Posters, digital ads, and event materials with
                          consistent branding elements.
                        </p>
                      </div>
                    </div>

                    {/* Card 5 */}
                    <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md overflow-hidden">
                      <div className="relative w-full aspect-[13/10]">
                        <Image
                          src="/assets/clothes Owen Brcye .png"
                          alt="Merchandise concepts preview"
                          fill
                          quality={90}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-[var(--foreground)]">
                          Merchandise Concepts
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          T-shirt, tote bag, and vinyl cover designs for fan
                          engagement and additional revenue.
                        </p>
                      </div>
                    </div>

                    {/* Card 6 */}
                    <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md overflow-hidden">
                      <div className="relative w-full aspect-[13/10]">
                        <Image
                          src="/assets/Colors Owen Bryce .png"
                          alt="Press kit palette"
                          fill
                          quality={90}
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-[var(--foreground)]">
                          Press Kit
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          Professional press materials for media outreach and
                          industry connections.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* Results & Impact */}
        <section className="reveal-section relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-12 md:py-20">
          {/* Rotated section number 06 */}
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute left-0 top-10 -rotate-90 select-none pointer-events-none">
            06
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="reveal-el font-primary text-3xl sm:text-4xl font-bold text-[var(--text)]">
              Results & Impact
            </h2>
            <div className="reveal-el h-1 w-16 bg-[var(--accent)] rounded mt-3 mb-6" />
            <p className="text-[var(--muted-foreground)] max-w-4xl leading-relaxed">
              The comprehensive promotional strategy delivered significant
              results for Owen Bryce’s EP launch, establishing a strong
              foundation for his music career and creating meaningful
              connections with his target audience.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md p-6 text-center">
                <div className="font-primary text-4xl font-extrabold text-[var(--accent)]">
                  45%
                </div>
                <p className="mt-3 text-xs text-[var(--muted-foreground)] leading-relaxed">
                  Increase in Instagram followers during the campaign period
                </p>
              </div>
              <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md p-6 text-center">
                <div className="font-primary text-4xl font-extrabold text-[var(--accent)]">
                  12K+
                </div>
                <p className="mt-3 text-xs text-[var(--muted-foreground)] leading-relaxed">
                  Spotify streams in the first month after release
                </p>
              </div>
              <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md p-6 text-center">
                <div className="font-primary text-4xl font-extrabold text-[var(--accent)]">
                  28%
                </div>
                <p className="mt-3 text-xs text-[var(--muted-foreground)] leading-relaxed">
                  Higher engagement rate compared to industry average
                </p>
              </div>
              <div className="pop-on-scroll bg-[var(--card)] rounded-xl shadow-md p-6 text-center">
                <div className="font-primary text-4xl font-extrabold text-[var(--accent)]">
                  3
                </div>
                <p className="mt-3 text-xs text-[var(--muted-foreground)] leading-relaxed">
                  Local press features secured through the campaign
                </p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="pop-on-scroll mt-10 md:mt-14 bg-[var(--card)] rounded-xl shadow-md p-6 md:p-8">
              <p className="font-primary text-lg md:text-xl leading-relaxed text-[var(--accent)]">
                "The promotional strategy transformed my EP release from a
                simple music drop to a comprehensive brand launch. The cohesive
                approach across platforms helped me connect with my audience in
                a meaningful way and establish a strong foundation for my music
                career."
              </p>
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                — Owen Bryce, Artist
              </p>
            </div>
          </div>
        </section>

        {/* Brand Guide */}
        <section className="reveal-section relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-12 md:py-20 bg-[var(--Secondary-Background)]">
          {/* Rotated section number 07 */}
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute right-0 top-10 -rotate-90 select-none pointer-events-none">
            07
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="reveal-el font-primary text-3xl sm:text-4xl font-bold text-[var(--text)]">
              Brand Guide
            </h2>
            <div className="reveal-el h-1 w-16 bg-[var(--accent)] rounded mt-3 mb-4" />
            <p className="text-[var(--muted-foreground)] max-w-4xl leading-relaxed">
              We developed a comprehensive brand guide to ensure consistency
              across all platforms and materials. This guide established the
              visual and tonal foundation for Owen Bryce’s artist identity.
            </p>

            <h3 className="mt-8 font-semibold text-[var(--foreground)]">
              Color Palette
            </h3>
            <div className="mt-4 grid grid-cols-5 gap-4 sm:gap-6">
              <div
                className="pop-on-scroll rounded-lg h-16 sm:h-20 shadow-inner flex items-end p-2 text-xs font-mono text-white"
                style={{ backgroundColor: "#1A2238" }}
              >
                #1A2238
              </div>
              <div
                className="pop-on-scroll rounded-lg h-16 sm:h-20 shadow-inner flex items-end p-2 text-xs font-mono text-black"
                style={{ backgroundColor: "#FFC107" }}
              >
                #FFC107
              </div>
              <div
                className="pop-on-scroll rounded-lg h-16 sm:h-20 shadow-inner flex items-end p-2 text-xs font-mono text-white"
                style={{ backgroundColor: "#26A69A" }}
              >
                #26A69A
              </div>
              <div
                className="pop-on-scroll rounded-lg h-16 sm:h-20 shadow-inner flex items-end p-2 text-xs font-mono text-black"
                style={{ backgroundColor: "#F5F5F5" }}
              >
                #F5F5F5
              </div>
              <div
                className="pop-on-scroll rounded-lg h-16 sm:h-20 shadow-inner flex items-end p-2 text-xs font-mono text-white"
                style={{ backgroundColor: "#333333" }}
              >
                #333333
              </div>
            </div>

            <h3 className="mt-8 font-semibold text-[var(--foreground)]">
              Typography System
            </h3>
            <div className="pop-on-scroll mt-3 bg-[var(--card)] rounded-xl shadow-md p-6 md:p-8">
              <h4 className="font-primary text-3xl sm:text-4xl font-extrabold text-[var(--foreground)]">
                Montserrat Bold
              </h4>
              <p className="mt-3 text-xl sm:text-2xl font-semibold text-[var(--foreground)]">
                Used for headings and titles
              </p>
              <div className="h-1 w-14 bg-[var(--accent)] rounded mt-2" />
              <p className="mt-4 font-semibold text-[var(--foreground)]">
                Creating visual impact and hierarchy
              </p>
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                Open Sans is our primary body text font. It offers excellent
                readability across devices and sizes, making it perfect for
                longer content blocks, descriptions, and informational text.
              </p>
              <p className="mt-3 text-xs italic text-[var(--muted-foreground)]">
                "Playfair Display adds an artistic touch to quotes and special
                callouts, reflecting the artistic nature of Owen’s music."
              </p>
            </div>

            <h3 className="mt-8 font-semibold text-[var(--foreground)]">
              Photography Style
            </h3>
            <p className="mt-2 text-[var(--muted-foreground)] leading-relaxed">
              The photography style emphasizes natural lighting, authentic
              moments, and connection with nature. Images feature warm tones,
              shallow depth of field, and candid expressions to convey
              authenticity and artistic depth.
            </p>

            <h3 className="mt-6 font-semibold text-[var(--foreground)]">
              Voice & Tone
            </h3>
            <p className="mt-2 text-[var(--muted-foreground)] leading-relaxed">
              Owen’s brand voice is authentic, thoughtful, and conversational.
              Communication should feel personal and direct, avoiding industry
              jargon in favor of genuine expression. The tone balances
              introspection with warmth and accessibility.
            </p>
          </div>
        </section>

        {/* Open Links CTA */}
        <section className="reveal-section relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-16 md:py-24">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Rotated section number */}
            <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute left-[-260px] top-0 -translate-y-1/2 -rotate-90 select-none pointer-events-none">
              08
            </div>

            <p className="reveal-el text-center text-sm text-[var(--muted-foreground)]">
              Choose a destination below — the live website or the design file
            </p>
            <h2 className="reveal-el mt-2 text-center font-primary text-2xl md:text-4xl font-semibold tracking-wide uppercase text-[var(--text)]">
              Where do you want to open Owen Bryce?
            </h2>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              <Link
                href="https://karimmassaoudd-portfolio-lastversion.netlify.app/html%20files/branding"
                target="_blank"
                rel="noopener noreferrer"
                className="pop-on-scroll group w-full sm:w-[460px] rounded-xl bg-[#0F5A7A] hover:bg-[#0D4E6A] text-white shadow-md transition-colors px-6 py-5 flex items-center justify-between gap-4"
              >
                <span className="flex items-center gap-4">
                  <span className="w-9 h-9 rounded-full border-2 border-white/30 grid place-items-center">
                    <Power className="w-4 h-4" />
                  </span>
                  <span className="font-primary text-lg md:text-xl tracking-wide">
                    Visit Website
                  </span>
                </span>
                <span className="text-[11px] font-medium bg-white/95 text-[#0F5A7A] rounded-full px-3 py-1 group-hover:bg-white">
                  Open Site
                </span>
              </Link>

              <Link
                href="https://www.figma.com/design/wwf7JufGQ256bQkzw13hPi/Owen-Bryce-Project?node-id=0-1&p=f&t=78KazWtBFSIHW0DS-0"
                target="_blank"
                rel="noopener noreferrer"
                className="pop-on-scroll group w-full sm:w-[460px] rounded-xl bg-[#0F5A7A] hover:bg-[#0D4E6A] text-white shadow-md transition-colors px-6 py-5 flex items-center justify-between gap-4"
              >
                <span className="flex items-center gap-4">
                  <span className="w-9 h-9 rounded-full border-2 border-white/30 grid place-items-center">
                    <GripVertical className="w-4 h-4" />
                  </span>
                  <span className="font-primary text-lg md:text-xl tracking-wide">
                    View Figma
                  </span>
                </span>
                <span className="text-[11px] font-medium bg-white/95 text-[#0F5A7A] rounded-full px-3 py-1 group-hover:bg-white">
                  Open File
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      </PageAnimator>
      <Footer />
    </>
  );
}
