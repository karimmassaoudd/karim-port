"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isMobileProjectsOpen, setIsMobileProjectsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const projectsBtnRef = useRef<HTMLButtonElement | null>(null);
  const projectsMenuRef = useRef<HTMLDivElement | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileProjectsBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Track which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "about",
        "user-experience",
        "contact",
        "projects",
        "project-details",
        "project-Triple-Wave",
        "project-Owen-Bryce",
      ];
      let current = "";
      let maxOverlap = 0;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Calculate how much of the section is visible in viewport
          const viewportHeight = window.innerHeight;
          const elementTop = rect.top;
          const elementBottom = rect.bottom;

          // Calculate overlap with upper half of viewport (for better priority)
          const overlapStart = Math.max(0, elementTop);
          const overlapEnd = Math.min(viewportHeight / 2, elementBottom);
          const overlap = Math.max(0, overlapEnd - overlapStart);

          if (overlap > maxOverlap) {
            maxOverlap = overlap;
            current = sectionId;
          }
        }
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial call to set the active section on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (projectsBtnRef.current) {
      projectsBtnRef.current.setAttribute(
        "aria-expanded",
        isProjectsOpen ? "true" : "false",
      );
    }
  }, [isProjectsOpen]);

  useEffect(() => {
    if (menuToggleRef.current) {
      menuToggleRef.current.setAttribute(
        "aria-expanded",
        isMenuOpen ? "true" : "false",
      );
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (mobileProjectsBtnRef.current) {
      mobileProjectsBtnRef.current.setAttribute(
        "aria-expanded",
        isMobileProjectsOpen ? "true" : "false",
      );
    }
  }, [isMobileProjectsOpen]);

  // Close desktop submenu on outside click or Esc
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!isProjectsOpen) return;
      const target = e.target as Node;
      if (
        projectsBtnRef.current?.contains(target) ||
        projectsMenuRef.current?.contains(target)
      )
        return;
      setIsProjectsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsProjectsOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isProjectsOpen]);

  // Smooth scroll function
  const _scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Logo click: if on home, scroll to hero; otherwise navigate home
  const handleLogoClick = () => {
    setIsMenuOpen(false);
    if (pathname === "/") {
      const hero = document.getElementById("hero");
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      router.push("/");
    }
  };

  const logoSrc = "/assets/K.svg";

  return (
    <header
      suppressHydrationWarning
      className={`flex items-center justify-between p-4 sm:p-6 px-4 sm:px-80 fixed w-full z-[100] backdrop-blur-md border-b transition-colors duration-300
      bg-gradient-to-b from-[var(--Secondary-Background)]/70 to-transparent border-black/5 dark:border-white/10
      `}
    >
      <div className="text-lg font-bold z-20">
        <button
          suppressHydrationWarning
          onClick={handleLogoClick}
          aria-label="Go home or scroll to hero"
          className="cursor-pointer group relative inline-flex items-center gap-2"
        >
          <Image src={logoSrc} alt="Logo" width={50} height={50} />
          {/* Hover-reveal full name next to logo */}
          <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm tracking-wider opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-[var(--accent)] bg-[var(--background)] px-2 py-1 rounded shadow">
            KARIM MASSAOUD
          </span>
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="flex gap-6 lg:gap-10 font-bold relative text-sm lg:text-base">
          <li>
            <Link
              href="/#about"
              onClick={() => setIsMenuOpen(false)}
              className={`nav-link cursor-pointer transition-colors ${activeSection === "about" ? "text-[var(--accent)] font-bold" : ""}`}
            >
              ABOUT
            </Link>
          </li>
          <li>
            <Link
              href="/#user-experience"
              onClick={() => setIsMenuOpen(false)}
              className="nav-link cursor-pointer"
            >
              USER EXPERIENCE
            </Link>
          </li>
          <li>
            <Link
              href="/#contact"
              onClick={() => setIsMenuOpen(false)}
              className={`nav-link cursor-pointer transition-colors ${activeSection === "contact" ? "text-[var(--accent)] font-bold" : ""}`}
            >
              CONTACT
            </Link>
          </li>
          <li className="relative">
            <button
              ref={projectsBtnRef}
              suppressHydrationWarning
              onClick={() => setIsProjectsOpen((s) => !s)}
              aria-haspopup="true"
              title="Open submenu"
              className={`nav-link cursor-pointer relative group transition-colors ${activeSection === "projects" || activeSection === "project-details" || activeSection === "project-Triple-Wave" || activeSection === "project-Owen-Bryce" ? "text-[var(--accent)] font-bold" : ""}`}
            >
              MY PROJECTS
              {/* Hover hint: small text below to indicate submenu */}
              <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1 text-[10px] tracking-wide text-[var(--secondary-text)] bg-[var(--background)]/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 shadow-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                submenu
              </span>
            </button>
            {/* Dropdown submenu */}
            <div
              ref={projectsMenuRef}
              className={`absolute left-1/2 -translate-x-1/2 mt-3 w-72 rounded-xl border border-[var(--accent)]/30 bg-[var(--background)]/98 backdrop-blur-md shadow-2xl ring-1 ring-[var(--accent)]/10 transition-all duration-200 ease-out origin-top z-50 overflow-hidden ${isProjectsOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
            >
              {/* caret */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rotate-45 bg-[var(--background)]/98 backdrop-blur-md border-l border-t border-[var(--accent)]/30 ring-1 ring-[var(--accent)]/10 rounded-sm" />

              {/* Header Section */}
              <div className="px-4 py-3 border-b border-[var(--accent)]/20 bg-gradient-to-r from-[var(--accent)]/5 to-transparent">
                <p className="text-xs font-semibold tracking-widest text-[var(--accent)] uppercase opacity-80">
                  Projects
                </p>
              </div>

              {/* All Projects Link - Featured */}
              <div className="px-3 py-2">
                <Link
                  href="/#projects"
                  role="menuitem"
                  tabIndex={isProjectsOpen ? 0 : -1}
                  className={`block px-3 py-3 rounded-lg transition-all ${activeSection === "projects" ? "bg-[var(--accent)]/20 text-[var(--accent)] font-semibold border border-[var(--accent)]/40 shadow-md shadow-[var(--accent)]/10" : "text-[var(--text)]/90 hover:bg-[var(--accent)]/10 border border-[var(--accent)]/20 hover:border-[var(--accent)]/30"} border`}
                  onClick={() => setIsProjectsOpen(false)}
                >
                  <span className="font-semibold text-sm">View All</span>
                  <p className="text-xs text-[var(--secondary-text)] mt-0.5">
                    Browse all projects
                  </p>
                </Link>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent mx-2" />

              {/* Individual Projects */}
              <ul className="py-2 px-2">
                <li>
                  <Link
                    href="/project-details"
                    role="menuitem"
                    tabIndex={isProjectsOpen ? 0 : -1}
                    className={`block px-3 py-2.5 rounded-lg transition-all ${pathname === "/project-details" ? "bg-[var(--accent)]/15 text-[var(--accent)] font-semibold border border-[var(--accent)]/30" : "text-[var(--text)]/80 hover:bg-[var(--accent)]/10 border border-transparent hover:border-[var(--accent)]/20"} border`}
                    onClick={() => setIsProjectsOpen(false)}
                  >
                    <span className="text-sm font-medium">Travel World</span>
                    <p className="text-xs text-[var(--secondary-text)] mt-0.5">
                      Travel website
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/project-Triple-Wave"
                    role="menuitem"
                    tabIndex={isProjectsOpen ? 0 : -1}
                    className={`block px-3 py-2.5 rounded-lg transition-all ${pathname === "/project-Triple-Wave" ? "bg-[var(--accent)]/15 text-[var(--accent)] font-semibold border border-[var(--accent)]/30" : "text-[var(--text)]/80 hover:bg-[var(--accent)]/10 border border-transparent hover:border-[var(--accent)]/20"} border`}
                    onClick={() => setIsProjectsOpen(false)}
                  >
                    <span className="text-sm font-medium">Triple WAVE</span>
                    <p className="text-xs text-[var(--secondary-text)] mt-0.5">
                      Student guide platform
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/project-Owen-Bryce"
                    role="menuitem"
                    tabIndex={isProjectsOpen ? 0 : -1}
                    className={`block px-3 py-2.5 rounded-lg transition-all ${pathname === "/project-Owen-Bryce" ? "bg-[var(--accent)]/15 text-[var(--accent)] font-semibold border border-[var(--accent)]/30" : "text-[var(--text)]/80 hover:bg-[var(--accent)]/10 border border-transparent hover:border-[var(--accent)]/20"} border`}
                    onClick={() => setIsProjectsOpen(false)}
                  >
                    <span className="text-sm font-medium">Owen Bryce</span>
                    <p className="text-xs text-[var(--secondary-text)] mt-0.5">
                      Artist branding campaign
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>

      {/* Right controls: theme toggle + mobile menu */}
      <div className="flex items-center gap-3 z-20 ml-6">
        <ThemeToggle />
        <div className="md:hidden">
          <button
            suppressHydrationWarning
            ref={menuToggleRef}
            className={`hamburger-button ${isMenuOpen ? "open" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
        <nav>
          <ul className="flex flex-col items-center gap-10 font-bold text-2xl">
            <li>
              <Link
                href="/#about"
                onClick={() => setIsMenuOpen(false)}
                className={`nav-link cursor-pointer transition-colors ${activeSection === "about" ? "text-[var(--accent)] font-bold" : ""}`}
              >
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                href="/#user-experience"
                onClick={() => setIsMenuOpen(false)}
                className={`nav-link cursor-pointer transition-colors ${activeSection === "user-experience" ? "text-[var(--accent)] font-bold" : ""}`}
              >
                USER EXPERIENCE
              </Link>
            </li>
            <li>
              <Link
                href="/#contact"
                onClick={() => setIsMenuOpen(false)}
                className={`nav-link cursor-pointer transition-colors ${activeSection === "contact" ? "text-[var(--accent)] font-bold" : ""}`}
              >
                CONTACT
              </Link>
            </li>
            <li>
              <button
                suppressHydrationWarning
                ref={mobileProjectsBtnRef}
                onClick={() => setIsMobileProjectsOpen((s) => !s)}
                aria-haspopup="true"
                className={`nav-link cursor-pointer transition-colors ${activeSection === "projects" || activeSection === "project-details" || activeSection === "project-Triple-Wave" || activeSection === "project-Owen-Bryce" ? "text-[var(--accent)] font-bold" : ""}`}
              >
                MY PROJECTS
              </button>
              <div
                className={`pl-4 mt-2 transition duration-200 ${isMobileProjectsOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
              >
                <ul className="flex flex-col gap-2 text-lg rounded-xl border border-white/10 bg-[var(--background)]/70 backdrop-blur-md p-2">
                  <li>
                    <Link
                      href="/#projects"
                      className="block px-3 py-2 rounded-md hover:bg-[var(--Secondary-Background)]/60"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileProjectsOpen(false);
                      }}
                    >
                      All Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/project-details"
                      className="block px-3 py-2 rounded-md hover:bg-[var(--Secondary-Background)]/60"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileProjectsOpen(false);
                      }}
                    >
                      Travel World
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/project-Triple-Wave"
                      className="block px-3 py-2 rounded-md hover:bg-[var(--Secondary-Background)]/60"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileProjectsOpen(false);
                      }}
                    >
                      Triple WAVE
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/project-Owen-Bryce"
                      className="block px-3 py-2 rounded-md hover:bg-[var(--Secondary-Background)]/60"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileProjectsOpen(false);
                      }}
                    >
                      Owen Bryce
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
