export async function setupHomeAnimations(root: HTMLElement) {
  if (typeof window === "undefined") return () => {};

  // Re-entry guard: ensure we initialize GSAP only once per root element at a time.
  // This helps avoid duplicate contexts in StrictMode/double mounts across pages.
  if ((root as any).dataset && (root as any).dataset.gsapInit === "1") {
    return () => {};
  }
  try {
    (root as any).dataset.gsapInit = "1";
  } catch {}

  const gsapModule = await import("gsap");
  const stModule = await import("gsap/ScrollTrigger");
  const gsap: any = (gsapModule as any).default ?? (gsapModule as any);
  const ScrollTrigger: any =
    (stModule as any).ScrollTrigger ?? (stModule as any).default;
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context((self: any) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        [
          "#hero h1",
          "#hero .portfolio-subtitle",
          "#hero .animate-arrow",
          "section.reveal-section",
          ".reveal-el",
          ".ux-item",
        ],
        { clearProps: "all" },
      );
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Responsive thresholds
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const START_REVEAL = isMobile ? "top 92%" : "top 85%";
      const START_ABOUT = isMobile ? "top 94%" : "top 88%";

      // Toggle: true enables scroll-scrub timelines; false uses enter/leave triggers (reversible both ways)
      const REVEAL_REVERSIBLE = false;

      // Section-level fade+slide — smooth and professional
      (gsap.utils.toArray("section.reveal-section") as HTMLElement[]).forEach(
        (sec) => {
          // Allow sections to opt-out of the global reveal if they provide their own local animation
          if ((sec as HTMLElement).dataset.once === "true") return;
          // baseline to avoid layout thrash
          gsap.set(sec, {
            transformOrigin: "center center",
            transformPerspective: 800,
            force3D: true,
          });

          if (REVEAL_REVERSIBLE) {
            // Use a single timeline per section so up/down scrolling feels cohesive
            const children = sec.querySelectorAll(".reveal-el");
            const lines = sec.querySelectorAll("div.h-px");
            gsap.set(sec, {
              autoAlpha: 0,
              y: 32,
              scale: 0.98,
              skewY: 0.3,
              willChange: "transform, opacity",
            });
            if (children.length) {
              gsap.set(children, {
                autoAlpha: 0,
                y: 24,
                rotateX: 2,
                transformPerspective: 800,
                filter: "blur(2px)",
                willChange: "transform, opacity, filter",
              });
            }
            if (lines.length) {
              gsap.set(lines, { scaleX: 0, transformOrigin: "right center" });
            }

            const tlSec = gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: {
                trigger: sec,
                start: "top 85%",
                end: "top 25%",
                scrub: 0.65,
              },
            });
            tlSec
              .to(
                sec,
                { autoAlpha: 1, y: 0, scale: 1, skewY: 0, duration: 0.6 },
                0,
              )
              .to(
                children,
                {
                  autoAlpha: 1,
                  y: 0,
                  rotateX: 0,
                  filter: "blur(0px)",
                  duration: 0.55,
                  stagger: 0.1,
                },
                0.05,
              )
              .to(lines, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0.1);
          } else {
            // Down & up: reveal on entering viewport from either direction; revert on leave (both directions)
            const children = sec.querySelectorAll(".reveal-el");
            const lines = sec.querySelectorAll("div.h-px");

            gsap.set(sec, { autoAlpha: 0, y: 28 });
            if (children.length)
              gsap.set(children, { autoAlpha: 0, y: 20, filter: "blur(2px)" });
            if (lines.length)
              gsap.set(lines, { scaleX: 0, transformOrigin: "right center" });

            const playReveal = () => {
              gsap.to(sec, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
              });
              if (children.length) {
                gsap.to(children, {
                  autoAlpha: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 0.6,
                  ease: "power2.out",
                  stagger: 0.08,
                });
              }
              if (lines.length) {
                gsap.to(lines, {
                  scaleX: 1,
                  duration: 0.5,
                  ease: "power2.out",
                });
              }
            };

            const revertReveal = () => {
              gsap.to(sec, {
                autoAlpha: 0,
                y: 28,
                duration: 0.4,
                ease: "power1.inOut",
              });
              if (children.length) {
                gsap.to(children, {
                  autoAlpha: 0,
                  y: 20,
                  filter: "blur(2px)",
                  duration: 0.35,
                  ease: "power1.inOut",
                  stagger: 0.06,
                });
              }
              if (lines.length) {
                gsap.to(lines, {
                  scaleX: 0,
                  duration: 0.3,
                  ease: "power1.inOut",
                });
              }
            };

            ScrollTrigger.create({
              trigger: sec,
              start: START_REVEAL,
              onEnter: playReveal,
              onEnterBack: playReveal,
              onLeave: revertReveal,
              onLeaveBack: revertReveal,
            });
          }
        },
      );

      // Stronger About-specific timeline to ensure visibility
      const about = document.querySelector("#about");
      if (about) {
        // set initial to avoid flash of content
        const aboutEls = about.querySelectorAll(
          ".reveal-el:not(.pop-on-scroll)",
        );
        if (aboutEls.length)
          gsap.set(aboutEls, { autoAlpha: 0, y: 24, filter: "blur(2px)" });
        if (REVEAL_REVERSIBLE) {
          const tlAbout = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
              trigger: "#about",
              start: "top 85%",
              end: "top 30%",
              scrub: 0.6,
            },
          });
          if (aboutEls.length) {
            tlAbout.to(
              aboutEls,
              { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.12 },
              0,
            );
          }
        } else {
          const playAbout = () => {
            if (aboutEls.length) {
              gsap.to(aboutEls, {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
              });
            }
          };
          const revertAbout = () => {
            if (aboutEls.length) {
              gsap.to(aboutEls, {
                autoAlpha: 0,
                y: 24,
                filter: "blur(2px)",
                stagger: 0.08,
                duration: 0.35,
                ease: "power1.inOut",
              });
            }
          };
          ScrollTrigger.create({
            trigger: "#about",
            start: START_ABOUT,
            onEnter: playAbout,
            onEnterBack: playAbout,
            onLeave: revertAbout,
            onLeaveBack: revertAbout,
          });
        }
      }

      // Footer animation handled locally in Footer.tsx using useEffect and ScrollTrigger (once-only)

      // Note: No GSAP hero animations per request (static hero)

      // Header auto-hide on scroll down, show on scroll up (with small threshold for stability)
      const showHeader = gsap
        .from("header", {
          yPercent: -100,
          duration: 0.3,
          ease: "power2.out",
          paused: true,
        })
        .progress(1);
      let lastScrollY = window.scrollY;
      ScrollTrigger.create({
        start: "top top",
        end: 99999,
        onUpdate: (self: any) => {
          const y = window.scrollY;
          const delta = Math.abs(y - lastScrollY);
          if (delta < 4) return; // ignore tiny jitter
          if (y < 80 || self.direction === -1)
            showHeader.play(); // near top or scrolling up
          else showHeader.reverse(); // scrolling down
          lastScrollY = y;
        },
      });

      // Section number full rotation + subtle parallax
      (gsap.utils.toArray(".text-number") as HTMLElement[]).forEach((numEl) => {
        const parentSec = numEl.closest("section") as HTMLElement | null;
        gsap.to(numEl, {
          y: -40,
          rotation: "+=360",
          transformOrigin: "50% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: parentSec ?? numEl,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Subtle parallax on About image for added depth
      if (document.querySelector("#about img")) {
        gsap.to("#about img", {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Pop-in batch animation for elements marked with .pop-on-scroll
      // One-way reveal: only play when entering while scrolling down. No reverse on scroll up or leaving.
      gsap.set(".pop-on-scroll", {
        scale: 0.8,
        autoAlpha: 0,
        willChange: "transform, opacity",
      });
      ScrollTrigger.batch(".pop-on-scroll", {
        start: START_REVEAL,
        onEnter: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.08,
          }),
        onEnterBack: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.06,
          }),
        onLeave: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 0.8,
            autoAlpha: 0,
            duration: 0.35,
            ease: "back.in(1.2)",
            stagger: 0.06,
          }),
        onLeaveBack: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 0.8,
            autoAlpha: 0,
            duration: 0.3,
            ease: "back.in(1.2)",
            stagger: 0.05,
          }),
      });

      // Keep ScrollTrigger layout in sync on viewport changes
      let resizeTimer: number | undefined;
      const onResize = () => {
        if (resizeTimer) window.clearTimeout(resizeTimer);
        // debounce to avoid thrashing
        resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
      };
      window.addEventListener("resize", onResize);
      // Also refresh after images load for accurate positions
      window.addEventListener("load", () => ScrollTrigger.refresh(), {
        once: true,
      } as any);

      // cleanup on context end
      self.add(() => {
        window.removeEventListener("resize", onResize);
      });

      // Also revert any matchMedia registrations created inside this context
      // Note: matchMedia contexts registered inside gsap.context are reverted automatically
      // by ctx.revert(). Calling mm.revert() here can double-revert and create recursion.
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
}
