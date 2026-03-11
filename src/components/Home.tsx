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

const Silk = dynamic(() => import("@/components/Silk"), {
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
  const [isDarkMode, setIsDarkMode] = useState(false);
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
        // Silently handle fetch errors
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
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);

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
        <div
          className="parallax-el absolute -left-20 top-0 h-96 w-96 rounded-full bg-[var(--accent)]/20 blur-3xl"
          data-scroll-speed="0.05"
        />

        {/* Top right accent blur */}
        <div
          className="parallax-el absolute -right-20 top-[10%] h-96 w-96 rounded-full bg-[var(--accent)]/20 blur-3xl"
          data-scroll-speed="0.08"
        />

        {/* Middle left white blur */}
        <div
          className="parallax-el absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-white/8 blur-[140px]"
          data-scroll-speed="0.12"
        />

        {/* Middle right accent blur */}
        <div
          className="parallax-el absolute -right-32 top-1/2 h-80 w-80 rounded-full bg-[var(--accent)]/18 blur-3xl"
          data-scroll-speed="0.06"
        />

        {/* Bottom left accent blur */}
        <div
          className="parallax-el absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-[var(--accent)]/15 blur-3xl"
          data-scroll-speed="0.1"
        />

        {/* Bottom right white blur */}
        <div
          className="parallax-el absolute -right-20 bottom-[5%] h-96 w-96 rounded-full bg-white/10 blur-[140px]"
          data-scroll-speed="0.15"
        />
      </div>

      <div className="relative z-10">
        <MantisLoader />
        <PageAnimator>
          <Header />
          <main ref={rootRef}>
            {/* HERO SECTION */}
            <section
              ref={heroRef}
              id="hero"
              className="group relative flex flex-col justify-center h-lvh overflow-visible"
            >
              {/* Silk Background */}
              <div
                className="pointer-events-none absolute -inset-2 transform-gpu z-0 transition-opacity duration-300"
                style={{ opacity: isDarkMode ? 1 : 0.4 }}
              >
                <Silk
                  speed={5}
                  scale={1}
                  color={isDarkMode ? "#3f4652" : backgroundColor}
                  noiseIntensity={isDarkMode ? 1.5 : 0.8}
                  rotation={0}
                />
              </div>
              <div className="text-center relative z-10">
                <h1 className="split-text mb-4">{pageData.hero.mainTitle}</h1>
                <h4 className="portfolio-subtitle reveal-el mb-8">
                  {pageData.hero.subtitle}
                </h4>
                <div className="reveal-el flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                  <a
                    href={pageData.hero.primaryButtonLink}
                    className="magnetic-el btn btn-primary text-sm py-2 px-6"
                  >
                    {pageData.hero.primaryButtonText}
                  </a>
                  <a
                    href={pageData.hero.secondaryButtonLink}
                    className="magnetic-el btn text-sm py-2 px-6 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 text-[var(--text)] font-medium text-center"
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
                  {experienceData.map((item) => {
                    const isOpen = openId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`ux-item pop-on-scroll border-b border-[var(--secondary-text)]/30 py-4 sm:py-6 transition-colors duration-300 ease-in-out ${isOpen
                          ? "bg-[var(--accent)]/5 rounded-lg px-2 sm:px-4 -mx-2 sm:-mx-4 border-transparent"
                          : "hover:border-[var(--accent)]/50"
                          }`}
                      >
                        <div
                          className="flex justify-between items-center cursor-pointer group"
                          onClick={() => setOpenId(isOpen ? null : item.id)}
                        >
                          <div className="flex items-center w-full pr-4">
                            <span
                              className={`text-sm sm:text-base mr-4 sm:mr-6 min-w-[30px] font-number transition-colors duration-300 ${isOpen
                                ? "text-[var(--accent)]"
                                : "text-[var(--secondary-text)] group-hover:text-[var(--text)]"
                                }`}
                            >
                              {`0${item.id}`}
                            </span>
                            <div className="flex-1">
                              <h3
                                className={`text-lg sm:text-xl font-primary tracking-wide transition-colors duration-300 ${isOpen
                                  ? "text-[var(--accent)]"
                                  : "text-[var(--text)] group-hover:text-[var(--accent)]"
                                  }`}
                              >
                                {item.title}
                              </h3>
                              <p className="text-[var(--secondary-text)] text-sm sm:text-base mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${isOpen
                              ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--card)] rotate-180"
                              : "border-[var(--secondary-text)]/50 text-[var(--text)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
                              }`}
                          >
                            <span className="text-xl leading-none">
                              {isOpen ? "−" : "+"}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`grid transition-all duration-500 ease-in-out ${isOpen
                            ? "grid-rows-[1fr] opacity-100 mt-5 sm:mt-6"
                            : "grid-rows-[0fr] opacity-0 mt-0"
                            }`}
                        >
                          <div className="overflow-hidden pl-[46px] sm:pl-[54px]">
                            <p className="text-[var(--text)]/90 text-sm sm:text-base leading-relaxed max-w-3xl pb-2">
                              {item.fullDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* CONTACT SECTION */}
            <ContactSection />
          </main>
          <Projects />
          <Footer />
        </PageAnimator>
        <ScrollToTopButton />
      </div>
    </>
  );
}
