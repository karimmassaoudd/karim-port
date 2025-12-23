"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdLocalPhone, MdOutlineKeyboardArrowDown } from "react-icons/md";
import BioTooltip from "@/components/BioTooltip";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageAnimator from "@/components/PageAnimator";
import Projects from "@/components/ProjectsSection";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const MantisLoader = dynamic(() => import("@/components/MantisLoader"), {
  ssr: false,
});

const ProfileCard = dynamic(() => import("@/components/ProfileCard"), {
  loading: () => (
    <div className="w-full h-[400px] animate-pulse bg-[var(--card)]/50 rounded-lg" />
  ),
  ssr: false,
});

const DarkVeil = dynamic(() => import("@/components/DarkVeil"), {
  ssr: false,
});

interface ExperienceItem {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
}

interface HomePageData {
  hero: {
    mainTitle: string;
    subtitle: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  bio: {
    bioText: string;
    maxWords: number;
  };
  about: {
    sectionLabel: string;
    heading: string;
    mainText: string;
    phoneNumber: string;
    email: string;
    linkedinUrl: string;
    profileCardName: string;
    profileCardTitle: string;
    profileCardHandle: string;
    profileCardAvatarUrl: string;
  };
  userExperience: {
    sectionLabel: string;
    heading: string;
    items: ExperienceItem[];
  };
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<
    [number, number, number]
  >([0.88, 0.87, 0.86]);
  const [openId, setOpenId] = useState<number | null>(4);
  const [pageData, setPageData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch homepage data from API
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (result.success) {
          setPageData(result.data);
        }
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

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
      const bgValue = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim();
      setBackgroundColor(colorToRGBArray(bgValue));
    };

    updateBackground();

    const observer = new MutationObserver(() => updateBackground());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", updateBackground);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateBackground);
    };
  }, []);

  // Show loading state
  if (loading || !pageData) {
    return (
      <>
        <Header />
        <PageAnimator>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[var(--text)]">Loading...</p>
            </div>
          </div>
        </PageAnimator>
        <Footer />
      </>
    );
  }

  const experienceData = pageData.userExperience.items;

  return (
    <>
      {/* Decorative blur background elements */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Top left accent blur */}
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-[var(--accent)]/20 blur-3xl" />

        {/* Top right accent blur */}
        <div className="absolute -right-20 top-[10%] h-96 w-96 rounded-full bg-[var(--accent)]/20 blur-3xl" />

        {/* Middle left white blur */}
        <div className="absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-white/8 blur-[140px]" />

        {/* Middle right accent blur */}
        <div className="absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-[var(--accent)]/18 blur-3xl" />

        {/* Bottom left accent blur */}
        <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-[var(--accent)]/15 blur-3xl" />

        {/* Bottom right white blur */}
        <div className="absolute -right-20 bottom-[5%] h-96 w-96 rounded-full bg-white/10 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <MantisLoader />
        <Header />
        <PageAnimator>
          <main ref={rootRef}>
            {/* HERO SECTION */}
            <section
              ref={heroRef}
              id="hero"
              className="group relative flex flex-col justify-center h-lvh overflow-visible"
            >
              {/* Hover veil like before – fades in on hover */}
              <div className="pointer-events-none absolute -inset-2 transform-gpu z-0 opacity-100">
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
              <div className="text-center relative z-10">
                <h1 className="hero-fade">{pageData.hero.mainTitle}</h1>
                <h4 className="portfolio-subtitle hero-fade hero-fade-delay">
                  {pageData.hero.subtitle}
                </h4>
                <div className="mt-6 sm:mt-8 hero-fade hero-fade-delay flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                  <a
                    href={pageData.hero.primaryButtonLink}
                    className="btn btn-primary text-sm py-2 px-6"
                  >
                    {pageData.hero.primaryButtonText}
                  </a>
                  <a
                    href={pageData.hero.secondaryButtonLink}
                    className="btn text-sm py-2 px-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 text-[var(--text)] font-medium text-center"
                  >
                    {pageData.hero.secondaryButtonText}
                  </a>
                </div>
              </div>
              <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-arrow">
                <MdOutlineKeyboardArrowDown
                  fontSize={45}
                  className="animate-bounce text-[var(--accent)]"
                />
              </div>

              {/* Bio Tooltip */}
              <BioTooltip
                bio={pageData.bio.bioText}
                maxWords={pageData.bio.maxWords}
              />
            </section>

            {/* ABOUT SECTION */}
            <section
              id="about"
              className="reveal-section relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden"
            >
              <div
                className="text-number absolute top-1/3 right-0 hidden lg:block text-[var(--secondary-text)] transform -translate-y-1/2 rotate-90 origin-center pointer-events-none select-none"
                aria-hidden
              >
                02
              </div>
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
                <div>
                  <div>
                    <h4 className="mb-2 text-right body-text-b reveal-el">
                      {pageData.about.sectionLabel}
                    </h4>
                    <div className="w-153 h-px bg-[var(--secondary-text)] opacity-50 mb-2" />
                    <h3 className="font-primary mb-6 pop-on-scroll">
                      {pageData.about.heading}
                    </h3>
                  </div>
                  <div className="min-h-[150px]">
                    <p
                      className="text-base sm:text-lg text-[var(--hero-about-text)] mb-4 align-middle pop-on-scroll leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: pageData.about.mainText,
                      }}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6 space-y-4 sm:space-y-0 sm:justify-between">
                    <div className="flex gap-6">
                      <a
                        href={`tel:${pageData.about.phoneNumber}`}
                        className="text-[var(--accent)] hover:text-btn-primary icon-link"
                        aria-label="Call me"
                      >
                        <MdLocalPhone size={24} />
                      </a>
                      <a
                        href={`mailto:${pageData.about.email}`}
                        className="text-[var(--accent)] hover:text-btn-primary icon-link"
                        aria-label="Email me"
                      >
                        <IoMdMail size={24} />
                      </a>
                      <a
                        href={pageData.about.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:text-btn-primary icon-link"
                        aria-label="My LinkedIn profile"
                      >
                        <FaLinkedin size={24} />
                      </a>
                    </div>
                    <div>
                      {/* Use a single anchor styled as button to avoid invalid nesting and hydration mismatches */}
                      <a
                        href="#contact"
                        className="btn btn-primary pop-on-scroll"
                        role="button"
                      >
                        CONTACT ME
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="pop-on-scroll">
                    {/* Profile Card with 3D tilt and holographic background */}
                    <ProfileCard
                      name={pageData.about.profileCardName}
                      title={pageData.about.profileCardTitle}
                      handle={pageData.about.profileCardHandle}
                      status="Online"
                      contactText="Contact Me"
                      avatarUrl={pageData.about.profileCardAvatarUrl}
                      showUserInfo={false}
                      enableTilt={true}
                      enableMobileTilt={false}
                      onContactClick={() =>
                        document.getElementById("contact")?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* USER EXPERIENCE SECTION */}
            <section
              id="user-experience"
              className="reveal-section bg-[var(--Secondary-Background)] text-[var(--text)] py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative"
            >
              <div className="text-number absolute top-9 left-0 -mt-0 -ml-0 text-[var(--secondary-text)] transform -rotate-270 text-6xl hidden md:block">
                03
              </div>
              <div className="max-w-5xl mx-auto">
                <div className="text-right mb-6">
                  <h4 className="body-text-b">
                    {pageData.userExperience.sectionLabel}
                  </h4>
                  <div className="h-px bg-[var(--secondary-text)] ml-auto max-w-[700px]" />
                  <h3 className="text-2xl sm:text-3xl md:text-4xl text-left font-primary mb-8 sm:mb-12 max-w-[700px] w-full ml-auto reveal-el">
                    {pageData.userExperience.heading}
                  </h3>
                </div>
                <div>
                  {experienceData.map((item) => (
                    <div
                      key={item.id}
                      className="ux-item pop-on-scroll border-b border-[var(--secondary-text)] py-3 sm:py-4 transition-all duration-300 ease-in-out"
                    >
                      <div
                        className="flex justify-between items-start cursor-pointer"
                        onClick={() =>
                          setOpenId(openId === item.id ? null : item.id)
                        }
                      >
                        <div className="flex items-start">
                          <span className="text-[var(--secondary-text)] mr-3 sm:mr-4 min-w-[20px] text-sm sm:text-base">{`0${item.id}`}</span>
                          <div>
                            <h3 className="text-base sm:text-lg text-[var(--text)] body-text-b">
                              {item.title}
                            </h3>
                            <p className="text-[var(--secondary-text)] text-xs sm:text-sm mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <span className="text-[var(--text)] text-2xl transition-transform duration-300">
                          {openId === item.id ? "−" : "+"}
                        </span>
                      </div>
                      <div
                        className={`transition-all duration-300 ease-in-out ${openId === item.id ? "max-h-[500px] opacity-100 mt-4 pl-8" : "max-h-0 opacity-0 mt-0 pl-8 overflow-hidden"}`}
                      >
                        <p className="text-[var(--secondary-text)] text-sm">
                          {item.fullDescription}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CONTACT SECTION */}
            <ContactSection />
          </main>
        </PageAnimator>
        <Projects />
        <Footer />
        <ScrollToTopButton />
      </div>
    </>
  );
}
