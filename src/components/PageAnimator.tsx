"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type PageAnimatorProps = {
  children: ReactNode;
  /**
   * When true, the GSAP animations are initialized for all matching elements inside this wrapper.
   * Leave true by default; set false only if a parent already initializes animations.
   */
  enable?: boolean;
};

export default function PageAnimator({
  children,
  enable = true,
}: PageAnimatorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!enable || !root) return;

    // Prevent overlapping inits on the same root during fast route changes
    if ((root as any).dataset && (root as any).dataset.gsapInit === "1") {
      return;
    }
    try {
      (root as any).dataset.gsapInit = "1";
    } catch { }

    const ctx = gsap.context((self) => {
      const select =
        self.selector?.bind(self) ??
        ((q: string) => Array.from(root.querySelectorAll(q)));

      // --- 1. Text Splitting (Letter-by-Letter) ---
      (select(".split-text") as HTMLElement[]).forEach((el) => {
        const text = el.innerText;
        el.innerHTML = "";
        text.split("").forEach((char) => {
          const span = document.createElement("span");
          span.innerText = char === " " ? "\u00A0" : char;
          span.style.display = "inline-block";
          span.className = "char";
          el.appendChild(span);
        });

        const chars = el.querySelectorAll(".char");
        gsap.fromTo(
          chars,
          { y: 40, opacity: 0, scale: 1.2, skewX: 10 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            skewX: 0,
            duration: 1.2,
            stagger: 0.03,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      // --- 2. Magnetic Effect ---
      const magneticEls = select(".magnetic-el") as HTMLElement[];
      magneticEls.forEach((el) => {
        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.6,
            ease: "power2.out",
          });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)",
          });
        });
      });

      // --- 3. Horizontal Scroll for Projects (REMOVED) ---
      // Reverted to original grid layout as per user request.

      // --- 4. Refined Section Reveals ---
      (gsap.utils.toArray<HTMLElement>(select("section.reveal-section")) || []).forEach((sec) => {
        const children = sec.querySelectorAll<HTMLElement>(".reveal-el");

        // Main section reveal
        gsap.fromTo(
          sec,
          { y: 60, autoAlpha: 0, skewY: 2 },
          {
            y: 0,
            autoAlpha: 1,
            skewY: 0,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "play reverse play reverse",
            },
          },
        );

        // Child reveals with delay
        if (children.length) {
          gsap.fromTo(
            children,
            { y: 30, autoAlpha: 0, scale: 0.95 },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              duration: 1,
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: sec,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        }
      });

      // --- 5. Parallax Elements ---
      (select(".parallax-el") as HTMLElement[]).forEach((el) => {
        const speed = parseFloat(el.dataset.scrollSpeed || "0.1");
        gsap.to(el, {
          y: () => -window.innerHeight * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Hero title scroll animations (keep existing but refine)
      const heroTitle = root.querySelector("section#hero h1");
      const heroSubtitle = root.querySelector("section#hero h4");

      if (heroTitle) {
        gsap.to(heroTitle, {
          y: -100,
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: root.querySelector("section#hero"),
            start: "top top",
            end: "40% top",
            scrub: true,
          },
        });
      }

      if (heroSubtitle) {
        gsap.to(heroSubtitle, {
          y: -50,
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: root.querySelector("section#hero"),
            start: "top top",
            end: "30% top",
            scrub: true,
          },
        });
      }

      // Pop-on-scroll elements: small scale-in
      gsap.set(select(".pop-on-scroll") as HTMLElement[], {
        scale: 0.9,
        autoAlpha: 0,
      });
      ScrollTrigger.batch(select(".pop-on-scroll"), {
        start: "top 90%",
        end: "bottom 10%",
        onEnter: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.1,
          }),
        onLeave: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 0.9,
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.in",
          }),
        onEnterBack: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.1,
          }),
        onLeaveBack: (batch: Element[]) =>
          gsap.to(batch, {
            scale: 0.9,
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.in",
          }),
      });
    }, root);

    return () => {
      try {
        ctx.revert();
      } finally {
        try {
          delete (root as any).dataset.gsapInit;
        } catch { }
      }
    };
  }, [enable]);

  return <div ref={rootRef}>{children}</div>;
}
