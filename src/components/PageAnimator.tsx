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
    } catch {}

    const ctx = gsap.context((self) => {
      const select =
        self.selector?.bind(self) ??
        ((q: string) => Array.from(root.querySelectorAll(q)));

      // Hero title scroll animations
      const heroTitle = root.querySelector("section#hero h1");
      const heroSubtitle = root.querySelector("section#hero h4");

      if (heroTitle) {
        gsap.set(heroTitle, { x: 0, opacity: 1 });
        gsap.to(heroTitle, {
          x: "150vw",
          opacity: 0,
          ease: "power3.in",
          scrollTrigger: {
            trigger: root.querySelector("section#hero"),
            start: "top top",
            end: "60% top",
            scrub: 1,
            markers: false,
          },
        });
        console.log("Hero title animation created");
      } else {
        console.log("Hero title NOT found");
      }

      if (heroSubtitle) {
        gsap.set(heroSubtitle, { x: 0, opacity: 1 });
        gsap.to(heroSubtitle, {
          x: "-150vw",
          opacity: 0,
          ease: "power3.in",
          scrollTrigger: {
            trigger: root.querySelector("section#hero"),
            start: "top top",
            end: "60% top",
            scrub: 1,
            markers: false,
          },
        });
        console.log("Hero subtitle animation created");
      } else {
        console.log("Hero subtitle NOT found");
      }

      // Section reveals (fade+slide) with symmetric up/down behavior
      (
        gsap.utils.toArray<HTMLElement>(select("section.reveal-section")) || []
      ).forEach((sec) => {
        const children = sec.querySelectorAll<HTMLElement>(".reveal-el");
        gsap.set(sec, { autoAlpha: 0, y: 28 });
        if (children.length) gsap.set(children, { autoAlpha: 0, y: 20 });

        // Section container
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

        // Child reveals
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

      // Pop-on-scroll elements: small scale-in
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
  }, [enable]);

  return <div ref={rootRef}>{children}</div>;
}
