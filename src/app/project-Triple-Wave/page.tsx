"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Tag,
  Target,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import DarkVeil from "@/components/DarkVeil";
import SectionBackground from "@/components/SectionBackground";

gsap.registerPlugin(ScrollTrigger);

// Trip themes (from Travel World)
type Theme = { id: number; title: string; images: string[] };
const themes: Theme[] = [
  {
    id: 1,
    title: "Housing",
    images: ["/assets/Room2.avif", "/assets/room3.jpg"],
  },
  {
    id: 2,
    title: "Transportation",
    images: ["/assets/OV chip card.png", "/assets/Bike triple wave.webp"],
  },
  {
    id: 3,
    title: "Local Events",
    images: ["/assets/Local event 1 .png", "/assets/Local Event 2.webp"],
  },
];

// (hover tiles section removed)

export default function TripleWaveProjectPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Clip used to constrain the screenshot inside the laptop display area
  const _laptopScreenClip = "inset(12.8% 11.8% 32.5% 11.8% round 12px)";

  // Shared background color for DarkVeil, synced with CSS --background
  const [backgroundColor, setBackgroundColor] = useState<
    [number, number, number]
  >([0.88, 0.87, 0.86]);

  // Carousel state (from ProjectDetails)
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const currentTheme = themes[currentThemeIndex];
  const currentImage = currentTheme.images[currentImageIndex];

  const handlePrevTheme = () => {
    setCurrentThemeIndex((i) => (i - 1 + themes.length) % themes.length);
    setCurrentImageIndex(0);
  };

  const handleNextTheme = () => {
    setCurrentThemeIndex((i) => (i + 1) % themes.length);
    setCurrentImageIndex(0);
  };

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(() => {
      setCurrentThemeIndex((i) => (i + 1) % themes.length);
      setCurrentImageIndex(0);
    }, 2000);
    return () => window.clearInterval(id);
  }, [isPaused]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    const threshold = 40;
    if (touchDeltaX.current > threshold) handlePrevTheme();
    else if (touchDeltaX.current < -threshold) handleNextTheme();
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // Sync DarkVeil backgroundColor with CSS var
  useEffect(() => {
    const colorToRGBArray = (colorStr: string): [number, number, number] => {
      if (!colorStr) return [0.88, 0.87, 0.86];
      if (colorStr.startsWith("oklch")) {
        if (colorStr.includes("1 0 0")) return [1, 1, 1];
        if (colorStr.includes("0.145 0 0")) return [0.145, 0.145, 0.145];
      }
      if (colorStr.startsWith("#")) {
        const hex = colorStr.replace("#", "");
        const bigint = Number.parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r / 255, g / 255, b / 255];
      }
      const match = colorStr.match(/rgb\s*\((\d+),\s*(\d+),\s*(\d+)\)/i);
      if (match) {
        const [, r, g, b] = match.map(Number);
        return [r / 255, g / 255, b / 255];
      }
      return [0.88, 0.87, 0.86];
    };

    const updateBackground = () => {
      const root = document.documentElement;
      const bgValue = getComputedStyle(root)
        .getPropertyValue("--background")
        .trim();
      setBackgroundColor(colorToRGBArray(bgValue));
    };
    updateBackground();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", updateBackground);

    const mo = new MutationObserver(updateBackground);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => {
      media.removeEventListener("change", updateBackground);
      mo.disconnect();
    };
  }, []);

  // Inline PageAnimator behavior (GSAP reveal + pop)
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if ((root as any).dataset && (root as any).dataset.gsapInit === "1") return;
    try {
      (root as any).dataset.gsapInit = "1";
    } catch {}

    const ctx = gsap.context((self) => {
      const select =
        self.selector?.bind(self) ??
        ((q: string) => Array.from(root.querySelectorAll(q)));

      (
        gsap.utils.toArray<HTMLElement>(select("section.reveal-section")) || []
      ).forEach((sec) => {
        const children = sec.querySelectorAll<HTMLElement>(".reveal-el");
        gsap.set(sec, { autoAlpha: 0, y: 28 });
        if (children.length) gsap.set(children, { autoAlpha: 0, y: 20 });

        gsap.fromTo(
          sec,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: sec,
              start: "top 85%",
              end: "bottom 25%",
              toggleActions: "play reverse play reverse",
            },
          },
        );

        if (children.length) {
          gsap.fromTo(
            children,
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              ease: "power2.out",
              immediateRender: false,
              stagger: 0.08,
              scrollTrigger: {
                trigger: sec,
                start: "top 85%",
                end: "bottom 25%",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        }
      });

      gsap.set(select(".pop-on-scroll") as HTMLElement[], {
        scale: 0.9,
        autoAlpha: 0,
      });
      ScrollTrigger.batch(select(".pop-on-scroll"), {
        start: "top 85%",
        onEnter: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.5,
            ease: "back.out(1.6)",
            stagger: 0.06,
          }),
        onLeave: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 0.9,
            autoAlpha: 0,
            duration: 0.3,
            ease: "power1.inOut",
            stagger: 0.05,
          }),
        onEnterBack: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.45,
            ease: "back.out(1.4)",
            stagger: 0.06,
          }),
        onLeaveBack: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 0.9,
            autoAlpha: 0,
            duration: 0.25,
            ease: "power1.inOut",
            stagger: 0.05,
          }),
      });
    }, root);

    return () => {
      try {
        ctx.revert();
      } finally {
        try {
          delete (root as any).dataset.gsapInit;
        } catch {}
      }
    };
  }, []);

  return (
    <div ref={rootRef} className="relative space-y-16 md:space-y-24">
      {/* Main Travel World project details (inlined) */}
      <main className="relative space-y-16 md:space-y-24">
        {/* Hero */}
        <section className="reveal-section group relative bg-[var(--background)] py-20 md:py-50 min-h-screen w-full overflow-hidden">
          <SectionBackground />
          <div className="pointer-events-none absolute inset-0 z-0 opacity-100">
            <DarkVeil
              hueShift={32}
              noiseIntensity={0.02}
              scanlineIntensity={0}
              scanlineFrequency={0}
              warpAmount={0.5}
              speed={1.5}
              backgroundColor={backgroundColor}
            />
          </div>
          <div className="max-w-7xl mx-auto px-9 sm:px-6 lg:px-8 min-h-[60vh] flex items-center relative z-10">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-items-center">
              <div className="col-span-1 text-center">
                <h2 className="reveal-el font-primary text-6xl md:text-7xl tracking-wide text-[var(--text)]">
                  TRIPLE WAVE
                </h2>
                <div className="reveal-el w-28 md:w-95 h-[3px] rounded-full bg-[var(--accent)] mt-2 mb-6 mx-auto" />
                <p className="reveal-el text-[var(--secondary-text)] text-lg md:text-xl leading-relaxed max-w-md mx-auto text-center">
                  A friendly guide for international students in Eindhoven find
                  housing, get around, manage finances, and discover local
                  events.
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-[2400px] px-6 md:px-8 lg:px-5 overflow-hidden">
                <div className="reveal-el scale-[1.15] md:scale-[1.2] transition-transform duration-500 ease-out group-hover:scale-[1.23]">
                  <Image
                    src="/assets/Triplewavelaptop.png"
                    alt="Laptop frame"
                    width={2000}
                    height={1125}
                    priority
                    className="w-full h-auto object-contain mix-blend-multiply dark:mix-blend-screen"
                  />
                  <div className="mx-auto mt-8 h-3 w-10/12 rounded-full bg-black/20 blur-[3px]" />
                </div>
              </div>
            </div>
          </div>
          <div className="scroll-cue text-[var(--accent)]" aria-hidden="true">
            <ChevronDown className="scroll-cue__icon" />
          </div>
        </section>

        {/* Overview */}
        <section className="reveal-section relative w-full bg-[var(--Secondary-Background)] py-16 md:py-20">
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute left-0 top-6 -rotate-90 select-none pointer-events-none">
            02
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-[11px] tracking-[0.18em] text-[var(--secondary-text)] uppercase">
                Section 02
              </p>
              <div className="w-50 h-1 rounded-full bg-[var(--accent)] mt-3 mb-1" />
              <h2 className="text-[var(--text)] font-primary text-4xl md:text-5xl leading-tight tracking-wide">
                OVERVIEW
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="reveal-el rounded-2xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-[var(--Secondary-Background)]/70 shadow-sm hover:shadow-md transition p-5 md:p-6 flex items-start gap-3">
                    <div className="mt-0.5 rounded-md p-1.5 bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)]">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] tracking-wide text-[var(--secondary-text)] mb-1">
                        ROLE
                      </p>
                      <p className="text-[var(--text)] font-semibold">
                        UX/UI Design & Front-end
                      </p>
                    </div>
                  </div>
                  <div className="reveal-el rounded-2xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-[var(--Secondary-Background)]/70 shadow-sm hover:shadow-md transition p-5 md:p-6 flex items-start gap-3">
                    <div className="mt-0.5 rounded-md p-1.5 bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)]">
                      <Tag size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] tracking-wide text-[var(--secondary-text)] mb-1">
                        TYPE
                      </p>
                      <p className="text-[var(--text)] font-semibold">
                        Student information website (Eindhoven)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="reveal-el rounded-2xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-[var(--Secondary-Background)]/70 shadow-sm hover:shadow-md transition p-5 md:p-6">
                  <p className="text-[11px] tracking-wide text-[var(--secondary-text)] mb-2">
                    HIGHLIGHTS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] md:text-sm bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)] shadow-sm transition transform hover:shadow-md hover:scale-[1.03]">
                      <Sparkles size={14} /> Housing options
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] md:text-sm bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)] shadow-sm transition transform hover:shadow-md hover:scale-[1.03]">
                      <Sparkles size={14} /> Transport guides
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] md:text-sm bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)] shadow-sm transition transform hover:shadow-md hover:scale-[1.03]">
                      <Sparkles size={14} /> Budgeting tips
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] md:text-sm bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)] shadow-sm transition transform hover:shadow-md hover:scale-[1.03]">
                      <Sparkles size={14} /> Local events
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] md:text-sm bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)] shadow-sm transition transform hover:shadow-md hover:scale-[1.03]">
                      <Sparkles size={14} /> Quick facts
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] md:text-sm bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)] shadow-sm transition transform hover:shadow-md hover:scale-[1.03]">
                      <Sparkles size={14} /> Testimonials
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5">
                <div className="relative group max-w-xl lg:ml-auto">
                  <div
                    className="absolute -inset-6 bg-[var(--accent)]/20 blur-3xl rounded-3xl opacity-0 group-hover:opacity-100 transition pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl pop-on-scroll bg-[var(--background)]">
                    <div className="relative w-full aspect-[5/2] overflow-hidden">
                      <Image
                        src="/assets/Overview Triple Wave .png"
                        alt="Triple Wave Overview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768	px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial block + content */}
        <section className="reveal-section relative py-16 md:py-20">
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute -right-0 top-6 -rotate-90 select-none pointer-events-none">
            03
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="col-span-12 lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 border border-white/10">
                <Image
                  src="/assets/Eindhoven Triple Wave .png"
                  alt="Triple Wave Eindhoven"
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-150 object-cover"
                  quality={95}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                />
              </div>
              <div className="col-span-12 lg:col-span-7 lg:pl-4">
                <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[var(--Secondary-Background)]/70 shadow-sm p-6">
                  <p className="text-xs tracking-wide text-[var(--secondary-text)] mb-1">
                    Project Summary
                  </p>
                  <h3 className="font-primary text-[var(--text)] text-3xl md:text-3xl leading-tight">
                    MODERN EINDHOVEN EXPERIENCE
                  </h3>
                  <div className="w-24 h-1 rounded-full bg-[var(--accent)] mt-3 mb-4" />
                  <p className="text-[var(--text)]/90 leading-relaxed mb-4">
                    A bold, modern website for Triple Wave that makes exploring
                    services and content feel smooth and intuitive.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <li>
                      <span className="font-semibold">Role:</span> UX/UI Design
                      & Front-end
                    </li>
                    <li>
                      <span className="font-semibold">Type:</span> Marketing
                      Website (Travel)
                    </li>
                    <li className="sm:col-span-2">
                      <span className="font-semibold">Highlights:</span>{" "}
                      Destination cards, special offers, testimonials, clear
                      CTAs
                    </li>
                  </ul>
                  <div className="mt-5">
                    <a
                      href="https://triple-wave.netlify.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-md font-semibold hover:bg-[var(--accent-hover)] transition shadow-md"
                    >
                      <ExternalLink size={16} />
                      <span>Open Live Demo</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supporting content band */}
        <section className="reveal-section relative w-full bg-[var(--Secondary-Background)] py-16 lg:py-20">
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute left-0 top-5 -rotate-90 select-none pointer-events-none">
            04
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center">
              <div className="mx-auto w-24 h-1 rounded-full bg-[var(--accent)] mb-10" />
              <p
                className="reveal-el font-primary text-3xl md:text-5xl leading-tight
							 tracking-wide text-[var(--text)] max-w-4xl mx-auto"
              >
                “MAKE EXPLORING TRIPLE WAVE’S WORLD SMOOTH AND INSPIRING.”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="pop-on-scroll rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[var(--Secondary-Background)]/70 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={18} />
                  <h4 className="font-primary text-lg text-[var(--text)]">
                    What I did
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-[var(--secondary-text)]">
                  <li>
                    Designed a clean, responsive layout with flowing wave
                    elements.
                  </li>
                  <li>
                    Built reusable sections for services, projects, and contact
                    details.
                  </li>
                  <li>
                    Focused on intuitive navigation and strong visual
                    consistency.
                  </li>
                </ul>
              </div>
              <div className="pop-on-scroll rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[var(--Secondary-Background)]/70 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={18} />
                  <h4 className="font-primary text-lg text-[var(--text)]">
                    Focus
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-[var(--secondary-text)]">
                  <li>Modern aesthetic with soft wave animations.</li>
                  <li>Balanced readability across light and dark modes.</li>
                  <li>
                    Seamless user flow with engaging transitions and clarity.
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-12">
              <div className="pop-on-scroll col-span-12 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 border border-white/10 bg-[var(--background)]">
                {/* Layered laptop mockup with new Triple Wave screenshot */}
                <div className="relative w-full aspect-[16/9]">
                  {/* Screen image clipped to the laptop display */}
                  <Image
                    src="/assets/Triple Wvee.jpg"
                    alt="Triple Wave screenshot"
                    fill
                    className="object-center object-cover"
                    sizes="250vw"
                  />
                </div>
              </div>
              <div className="pop-on-scroll col-span-12 md:col-span-6 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 border border-white/10 bg-[var(--background)]">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/assets/Triple Wave2.jpg"
                    alt="Triple Wave section"
                    fill
                    className="object-center object-cover"
                    sizes="(max-width: 768px) 200vw, 100vw"
                  />
                </div>
              </div>
              <div className="pop-on-scroll col-span-12 md:col-span-6 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 border border-white/10 bg-[var(--background)]">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/assets/Room2.avif"
                    alt="Triple Wave interior"
                    fill
                    quality={90}
                    className="object-cover"
                    sizes="(max-width: 768px) 200vw, 100vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trip Themes */}
        <section className="reveal-section relative w-full py-16 md:py-20">
          <div className="hidden lg:block text-number text-9x1 text-[var(--secondary-text)] absolute -right-0 top-0 -rotate-90 select-none pointer-events-none">
            05
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="reveal-el text-[11px] tracking-[0.18em] text-[var(--secondary-text)] uppercase mb-2">
              EXPLORE EINDHOVEN
            </p>
            <div className="reveal-el w-24 h-1 rounded-full bg-[var(--accent)] mt-1 mb-1" />
            <h2 className="text-[var(--text)] font-primary text-4xl md:text-5xl mb-8 reveal-el">
              CITY VIBES
            </h2>

            <div
              className="relative flex items-center justify-center gap-8"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <button
                onClick={handlePrevTheme}
                aria-label="Previous theme"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[var(--Secondary-Background)]/70 hover:bg-[var(--Secondary-Background)] text-[var(--text)] shadow-lg border border-white/10 backdrop-blur"
              >
                <ChevronLeft size={28} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                <div
                  className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl ring-1 
								ring-black/5 border border-white/10 bg-[var(--background)]"
                >
                  <Image
                    key={`${currentTheme.id}-a`}
                    src={currentImage}
                    alt={`${currentTheme.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover transition-opacity duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div
                  className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl ring-1 
								ring-black/5 border border-white/10 bg-[var(--background)]"
                >
                  <Image
                    key={`${currentTheme.id}-b`}
                    src={
                      currentTheme.images[
                        (currentImageIndex + 1) % currentTheme.images.length
                      ]
                    }
                    alt={`${currentTheme.title} - Image ${((currentImageIndex + 1) % currentTheme.images.length) + 1}`}
                    fill
                    className="object-cover transition-opacity duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              <button
                onClick={handleNextTheme}
                aria-label="Next theme"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full 
								bg-[var(--Secondary-Background)]/70 hover:bg-[var(--Secondary-Background)]
								text-[var(--text)] shadow-lg border border-white/10 backdrop-blur"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            <h3 className="mt-10 text-center font-primary text-3xl md:text-4xl tracking-wide text-[var(--text)]">
              DISCOVER THE CITY'S ENERGY
            </h3>
            <p className="mt-3 text-center text-sm md:text-base text-[var(--secondary-text)] max-w-3xl mx-auto">
              Swipe through vibrant neighborhoods, iconic landmarks, and hidden
              gems that give Eindhoven its character.
            </p>

            <p className="text-center text-sm text-[var(--secondary-text)] mt-5">
              {currentTheme.title}
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              {themes.map((t, idx) => (
                <button
                  key={t.id}
                  aria-label={`Go to ${t.title}`}
                  onClick={() => {
                    setCurrentThemeIndex(idx);
                    setCurrentImageIndex(0);
                  }}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${idx === currentThemeIndex ? "bg-[var(--accent)] w-6" : "bg-[var(--secondary-text)]/30"}`}
                />
              ))}
            </div>
            <p className="text-center text-xs text-[var(--secondary-text)] mt-2">
              Swipe or use arrows •{" "}
              {(currentThemeIndex + 1).toString().padStart(2, "0")} /{" "}
              {themes.length.toString().padStart(2, "0")}
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="reveal-section relative w-full py-16 md:py-20">
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute -right-1 top-0 -rotate-90 select-none pointer-events-none">
            07
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-24 h-1 rounded-full bg-[var(--accent)] mb-3" />
            <p className="text-sm text-[var(--secondary-text)] mb-4">
              Choose a destination below — the live website or the design file
            </p>
            <h2 className="reveal-el text-[var(--text)] font-primary text-4xl md:text-5xl mb-12">
              WHERE DO YOU WANT TO OPEN TRAVEL WORLD?
            </h2>

            <div className="max-w-3xl md:max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-stretch">
              <a
                href="https://triple-wave.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="pop-on-scroll ticket-button group relative rounded-xl bg-[var(--accent)] text-white shadow-lg ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-[2px] w-full"
                aria-label="Open live website"
              >
                <div className="pointer-events-none absolute inset-0 opacity-20 bg-gradient-to-br from-white/15 via-white/0 to-black/10" />
                <div className="relative flex items-center justify-between gap-4 px-5 md:px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-[var(--accent)] shadow-sm">
                      🔗
                    </span>
                    <div className="leading-tight">
                      <p className="text-xs tracking-wider uppercase/relaxed text-white/80">
                        Destination
                      </p>
                      <p className="text-base md:text-lg font-semibold">
                        Visit Website
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white text-[var(--accent)] px-3 py-1 text-xs md:text-sm font-semibold shadow-sm transition-colors group-hover:bg-white/95">
                    Open Site
                  </span>
                </div>
              </a>

              <a
                href="https://www.figma.com/design/q9bDKW2cMNRxMIYQSlBnXP/Eindhoven-Project?node-id=0-1&p=f&t=nKN6wv6YFlZYCyO7-0"
                target="_blank"
                rel="noopener noreferrer"
                className="pop-on-scroll ticket-button group relative rounded-xl bg-[var(--accent)] text-white shadow-lg ring-1 ring-white/10 transition-all duration-200 hover:-translate-y-[2px] w-full"
                aria-label="Open Figma design file"
              >
                <div className="pointer-events-none absolute inset-0 opacity-20 bg-gradient-to-br from-white/15 via-white/0 to-black/10" />
                <div className="relative flex items-center justify-between gap-4 px-5 md:px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-[var(--accent)] shadow-sm">
                      🎨
                    </span>
                    <div className="leading-tight">
                      <p className="text-xs tracking-wider uppercase/relaxed text-white/80">
                        Design file
                      </p>
                      <p className="text-base md:text-lg font-semibold">
                        View Figma
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white text-[var(--accent)] px-3 py-1 text-xs md:text-sm font-semibold shadow-sm transition-colors group-hover:bg-white/95">
                    Open File
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
