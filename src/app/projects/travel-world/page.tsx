"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Briefcase,
  CheckCircle2,
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
import Footer from "@/components/Footer";
import Header from "@/components/Header";

gsap.registerPlugin(ScrollTrigger);

type Theme = { id: number; title: string; images: string[] };
const themes: Theme[] = [
  {
    id: 1,
    title: "Luxury Beach Getaways",
    images: [
      "/assets/Luxury Beach Getaways 1.jpg",
      "/assets/Luxury Beach Getaways 2.webp",
    ],
  },
  {
    id: 2,
    title: "Mountain Adventures",
    images: [
      "/assets/Mountain Adventures 1.jpg",
      "/assets/Mountain Adventures 2.jpeg",
    ],
  },
  {
    id: 3,
    title: "Luxury Cruise Experiences",
    images: [
      "/assets/Luxury Cruise Experiences 1.jpeg",
      "/assets/Luxury Cruise Experiences 2.jpg",
    ],
  },
];

export default function TravelWorldPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<
    [number, number, number]
  >([0.88, 0.87, 0.86]);
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

  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(() => {
      setCurrentThemeIndex((i) => (i + 1) % themes.length);
      setCurrentImageIndex(0);
    }, 5000);
    return () => window.clearInterval(id);
  }, [isPaused]);

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

  // Inline PageAnimator behavior (GSAP)
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (root.dataset.gsapInit === "1") return;
    try {
      root.dataset.gsapInit = "1";
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
          delete root.dataset.gsapInit;
        } catch {}
      }
    };
  }, []);

  return (
    <>
      <Header />
      <div ref={rootRef} className="relative space-y-16 md:space-y-24">
        {/* Hero */}
        <section className="reveal-section group relative bg-[var(--background)] py-20 md:py-50 min-h-screen w-full overflow-hidden">
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
                <h3 className="reveal-el font-primary text-6xl md:text-7xl tracking-wide text-[var(--text)]">
                  TRAVEL WORLD
                </h3>
                <div className="reveal-el w-28 md:w-95 h-[3px] rounded-full bg-[var(--accent)] mt-2 mb-6 mx-auto" />
                <p className="reveal-el text-[var(--secondary-text)] text-lg md:text-xl leading-relaxed max-w-md mx-auto text-center">
                  A simple, friendly travel website that makes exploring
                  destinations feel fun and effortless.
                </p>
              </div>
              <div className="relative mx-auto w-full max-w-[2100px] px-8 md:px-12 lg:px-16 overflow-hidden">
                <div className="relative reveal-el scale-[1.15] md:scale-[1.2] transition-transform duration-500 ease-out group-hover:scale-[1.23]">
                  <Image
                    src="/assets/travelworld_laptop_4k_transparent_crisp 1.png"
                    alt="Travel World laptop mockup"
                    width={2000}
                    height={1125}
                    priority
                    className="w-full h-auto object-contain"
                  />
                  <div
                    className="absolute overflow-hidden rounded-[14px] shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
                    style={{
                      left: "11%",
                      top: "7%",
                      width: "78%",
                      height: "70%",
                    }}
                  >
                    <Image
                      src="/assets/Travel World22.jpg"
                      alt="Travel World experience preview"
                      fill
                      sizes="(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 90vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="mx-auto mt-8 h-3 w-10/12 rounded-full bg-black/20 blur-[3px]" />
                </div>
              </div>
            </div>
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
              <h3 className="text-[var(--text)] font-primary text-4xl md:text-5xl leading-tight tracking-wide">
                OVERVIEW
              </h3>
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
                        Marketing Website (Travel)
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
                      <Sparkles size={14} /> Destination cards
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] md:text-sm bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)] shadow-sm transition transform hover:shadow-md hover:scale-[1.03]">
                      <Sparkles size={14} /> Special offers
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] md:text-sm bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)] shadow-sm transition transform hover:shadow-md hover:scale-[1.03]">
                      <Sparkles size={14} /> Testimonials
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] md:text-sm bg-[var(--Secondary-Background)]/70 border border-white/10 text-[var(--text)] shadow-sm transition transform hover:shadow-md hover:scale-[1.03]">
                      <Sparkles size={14} /> Clear CTAs
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5">
                <div className="relative group w-full">
                  <div
                    className="absolute -inset-6 bg-[var(--accent)]/20 blur-3xl rounded-3xl opacity-0 group-hover:opacity-100 transition pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl pop-on-scroll bg-[var(--background)]">
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src="/assets/Travel world laptop2.jpg"
                        alt="Travel World promotional still"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        quality={90}
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Challenge */}
        <section className="reveal-section relative py-20 bg-[#070b12] overflow-hidden">
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute -right-0 top-6 -rotate-90 select-none pointer-events-none opacity-20">
            03
          </div>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20">
              <div className="flex-1 lg:w-1/2 reveal-el">
                <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                  <Image
                    src="/assets/Travel World Project Background .png"
                    alt="Travel World challenge preview"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="flex-1 lg:w-1/2 flex items-center reveal-el">
                <div className="w-full bg-[#0a0f18]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative text-left">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--accent)]/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  <div className="relative z-10 space-y-8">
                    <div>
                      <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-[var(--secondary-text)] uppercase mb-3 opacity-60">
                        Project Summary
                      </p>
                      <h3 className="text-3xl md:text-4xl xl:text-5xl text-white font-primary tracking-wide leading-tight uppercase m-0">
                        The Challenge
                      </h3>
                      <div className="w-20 h-[2px] bg-[var(--accent)] mt-4" />
                    </div>

                    <p className="text-sm md:text-base text-[#a0acb9] font-secondary leading-relaxed font-light">
                      International travelers often find existing trip planning
                      platforms clunky and overwhelming. The goal was to build a
                      modern, high-performance travel guide that makes
                      inspiration and booking feel effortless.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[10px] tracking-widest text-[#a0acb9]/60 font-semibold mb-1 uppercase">
                          Role
                        </p>
                        <p className="text-sm text-white font-secondary">
                          Lead Designer & Developer
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-widest text-[#a0acb9]/60 font-semibold mb-1 uppercase">
                          Type
                        </p>
                        <p className="text-sm text-white font-secondary">
                          E-commerce / Travel
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-[10px] tracking-widest text-[#a0acb9]/60 font-semibold mb-1 uppercase">
                          Highlights
                        </p>
                        <p className="text-sm text-white font-secondary leading-relaxed">
                          Destination cards, live booking, curated themes, and
                          high-quality mockups.
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://travel-website-complete-w0th.onrender.com/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-3.5 bg-[var(--accent)] text-white rounded-xl text-sm font-bold tracking-wide hover:bg-[#144880] transition-all duration-300 hover:-translate-y-1"
                    >
                      <ExternalLink size={18} />
                      OPEN LIVE DEMO
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Supporting band + quote + cards + images */}
        <section className="reveal-section relative w-full bg-[var(--Secondary-Background)] py-16 lg:py-20">
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute left-0 top-5 -rotate-90 select-none pointer-events-none">
            04
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center">
              <div className="mx-auto w-24 h-1 rounded-full bg-[var(--accent)] mb-4" />
              <p className="reveal-el font-primary text-3xl md:text-5xl leading-tight tracking-wide text-[var(--text)] max-w-4xl mx-auto">
                “MAKE EXPLORING DESTINATIONS FUN AND EFFORTLESS.”
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
                    Designed reusable destination cards with clear hierarchy.
                  </li>
                  <li>Structured special offers with strong visual focus.</li>
                  <li>Clear CTAs and consistent spacing rhythm.</li>
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
                  <li>Editorial layout with alternating bands.</li>
                  <li>Better readability in both light and dark mode.</li>
                  <li>Soft motion with no hydration issues.</li>
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-12">
              <div className="pop-on-scroll col-span-12 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 border border-white/10 bg-[var(--background)]">
                <div className="relative w-full aspect-[21/9]">
                  <Image
                    src="/assets/Travel world Background .png"
                    alt="Travel World full-page background screen"
                    fill
                    className="object-cover object-top"
                    quality={90}
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
              <div className="pop-on-scroll col-span-12 md:col-span-4 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 border border-white/10 bg-[var(--background)]">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/assets/Travel World Second Section .png"
                    alt="Travel World second section"
                    fill
                    className="object-cover"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              <div className="pop-on-scroll col-span-12 md:col-span-4 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 border border-white/10 bg-[var(--background)]">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/assets/Travel world Third section Picture.png"
                    alt="Travel World destination section"
                    fill
                    className="object-cover"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              <div className="pop-on-scroll col-span-12 md:col-span-4 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 border border-white/10 bg-[var(--background)]">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/assets/Travel world Fourth Picture .png"
                    alt="Travel World booking section"
                    fill
                    className="object-cover"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 33vw"
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
              Curated journeys
            </p>
            <div className="reveal-el w-24 h-1 rounded-full bg-[var(--accent)] mt-1 mb-1" />
            <h3 className="text-[var(--text)] font-primary text-4xl md:text-5xl mb-8 reveal-el">
              TRIP THEMES
            </h3>
            <fieldset
              className="relative flex items-center justify-center gap-8"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <legend className="sr-only">Trip theme carousel</legend>
              <button
                type="button"
                onClick={handlePrevTheme}
                aria-label="Previous theme"
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[var(--Secondary-Background)]/70 hover:bg-[var(--Secondary-Background)] text-[var(--text)] shadow-lg border border-white/10 backdrop-blur"
              >
                <ChevronLeft size={28} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 border border-white/10 bg-[var(--background)]">
                  <Image
                    key={`${currentTheme.id}-a`}
                    src={currentImage}
                    alt={`${currentTheme.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover transition-opacity duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 border border-white/10 bg-[var(--background)]">
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
                type="button"
                onClick={handleNextTheme}
                aria-label="Next theme"
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[var(--Secondary-Background)]/70 hover:bg-[var(--Secondary-Background)] text-[var(--text)] shadow-lg border border-white/10 backdrop-blur"
              >
                <ChevronRight size={28} />
              </button>
            </fieldset>
            <p className="text-center text-sm text-[var(--secondary-text)] mt-5">
              {currentTheme.title}
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              {themes.map((t, idx) => (
                <button
                  type="button"
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

        {/* Special Offers */}
        <section className="reveal-section relative w-full bg-[var(--Secondary-Background)] py-16 md:py-20">
          <div className="hidden lg:block text-number text-6xl text-[var(--secondary-text)] absolute left-0 top-6 -rotate-90 select-none pointer-events-none">
            06
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="reveal-el text-sm text-[var(--secondary-text)] mb-4">
              Take advantage of our limited-time deals and save on your next
              adventure.
            </p>
            <div className="reveal-el w-24 h-1 rounded-full bg-[var(--accent)] mb-6" />
            <h3 className="reveal-el text-[var(--text)] font-primary text-4xl md:text-5xl mb-8">
              SPECIAL OFFERS
            </h3>
            <div className="reveal-el rounded-3xl bg-[var(--background)] border border-black/5 dark:border-white/10 shadow-xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="pop-on-scroll group rounded-2xl bg-white dark:bg-[var(--Secondary-Background)] text-[var(--foreground)] border border-black/5 dark:border-white/10 shadow-md p-5 relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <span className="absolute -top-3 right-4 bg-[#e25b45] text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                    Save 25%
                  </span>
                  <h3 className="font-semibold text-[var(--text)] text-xl">
                    Summer Escape to Bali
                  </h3>
                  <p className="text-[var(--secondary-text)] text-sm mt-2">
                    7 nights at a luxury beachfront resort with daily breakfast
                    and transfers.
                  </p>
                  <div className="mt-4 text-sm">
                    <span className="line-through opacity-70 mr-2">$1,199</span>
                    <span className="font-bold">$899</span>
                  </div>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 text-[var(--accent)] border border-[var(--accent)]/40 px-3 py-1.5 rounded-md hover:bg-[var(--accent)] hover:text-white transition"
                  >
                    Book Now
                  </button>
                </div>
                <div className="pop-on-scroll group rounded-2xl bg-white dark:bg-[var(--Secondary-Background)] text-[var(--foreground)] border border-black/5 dark:border-white/10 shadow-md p-5 relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <span className="absolute -top-3 right-4 bg-[#e25b45] text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                    Save 20%
                  </span>
                  <h3 className="font-semibold text-[var(--text)] text-xl">
                    Romantic Paris Getaway
                  </h3>
                  <p className="text-[var(--secondary-text)] text-sm mt-2">
                    5 nights near the Eiffel Tower with Seine cruise and museum
                    passes.
                  </p>
                  <div className="mt-4 text-sm">
                    <span className="line-through opacity-70 mr-2">$1,349</span>
                    <span className="font-bold">$1,079</span>
                  </div>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 text-[var(--accent)] border border-[var(--accent)]/40 px-3 py-1.5 rounded-md hover:bg-[var(--accent)] hover:text-white transition"
                  >
                    Book Now
                  </button>
                </div>
                <div className="pop-on-scroll group rounded-2xl bg-white dark:bg-[var(--Secondary-Background)] text-[var(--foreground)] border border-black/5 dark:border-white/10 shadow-md p-5 relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <span className="absolute -top-3 right-4 bg-[#e25b45] text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                    Save 30%
                  </span>
                  <h3 className="font-semibold text-[var(--text)] text-xl">
                    Greek Island Hopping
                  </h3>
                  <p className="text-[var(--secondary-text)] text-sm mt-2">
                    10-day adventure through the Cyclades with transfers and
                    guided tours.
                  </p>
                  <div className="mt-4 text-sm">
                    <span className="line-through opacity-70 mr-2">$1,899</span>
                    <span className="font-bold">$1,329</span>
                  </div>
                  <button
                    type="button"
                    className="mt-4 inline-flex items-center gap-2 text-[var(--accent)] border border-[var(--accent)]/40 px-3 py-1.5 rounded-md hover:bg-[var(--accent)] hover:text-white transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
              <p className="text-[var(--secondary-text)] text-sm mt-4">
                Limited-time deals to save on your next adventure.
              </p>
            </div>
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
            <h3 className="reveal-el text-[var(--text)] font-primary text-4xl md:text-5xl mb-12">
              WHERE DO YOU WANT TO OPEN TRAVEL WORLD?
            </h3>
            <div className="max-w-3xl md:max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-stretch">
              <a
                href="https://travel-website-complete-w0th.onrender.com/index.html"
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
                href="https://www.figma.com/design/rzN9N9qsHKqxYUwQpsEwfn/Untitled?node-id=0-1&p=f&t=aGmk5l4FXR8dXmtn-0"
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
      </div>
      <Footer />
    </>
  );
}
