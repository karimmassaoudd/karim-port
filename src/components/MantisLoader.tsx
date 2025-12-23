"use client";

import gsap from "gsap";
import { useEffect, useState } from "react";

const LOADER_TEXT = process.env.NEXT_PUBLIC_LOADER_TEXT ?? "KARIM MASSAOUD";
const LOADER_TEXT_COLOR =
  process.env.NEXT_PUBLIC_LOADER_TEXT_COLOR ?? "#155B86";

/**
 * Animated splash loader that reveals the portfolio brand before the main UI mounts.
 */
export default function MantisLoader() {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const originalPointerEvents = document.body.style.pointerEvents;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.pointerEvents = "none";

    const timeline = gsap.timeline();
    const letters = document.querySelectorAll<HTMLElement>(".loader-letter");
    const letterDuration = 0.3;
    const letterDelay = 0.06;

    letters.forEach((letter, index) => {
      timeline.to(
        letter,
        {
          opacity: 1,
          y: 0,
          duration: letterDuration,
          ease: "back.out",
        },
        index * letterDelay,
      );
    });

    timeline.to(
      ".loader-progress",
      {
        width: "100%",
        duration: 0.8,
        ease: "power2.inOut",
      },
      0,
    );

    timeline.to(
      { value: 0 },
      {
        value: 100,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate() {
          const currentValue = Math.round(
            (this.targets()[0] as { value: number }).value,
          );
          setPercentage(currentValue);
          const percentageElement =
            document.querySelector<HTMLElement>(".loader-percentage");
          if (percentageElement) {
            percentageElement.style.left = `${currentValue}%`;
            percentageElement.style.transform = "translateX(-100%)";
          }
        },
      },
      0,
    );

    const fadeOutDuration = 0.2;
    const fadeTimer = window.setTimeout(() => {
      gsap.to("#mantis-loader", {
        opacity: 0,
        duration: fadeOutDuration,
        ease: "power2.inOut",
      });
    }, 700);

    const exitTimer = window.setTimeout(() => {
      const loaderElement = document.getElementById("mantis-loader");
      if (loaderElement) {
        loaderElement.style.display = "none";
      }
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.body.style.pointerEvents = originalPointerEvents;
    }, 1100);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(exitTimer);
      timeline.kill();
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.body.style.pointerEvents = originalPointerEvents;
    };
  }, []);

  return (
    <div
      id="mantis-loader"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#1a1a1a]/40 backdrop-blur-xl font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif] transition-opacity duration-300"
    >
      <div className="loader-progress fixed bottom-[30%] left-0 z-50 h-[3px] w-0 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
      <div className="loader-percentage fixed bottom-[27%] z-50 text-xs font-medium text-white">
        {percentage}%
      </div>
      <div
        className="loader-text fixed left-10 top-[58%] z-50 flex items-center justify-start whitespace-nowrap font-bold leading-none text-white"
        style={{ color: LOADER_TEXT_COLOR }}
      >
        {LOADER_TEXT.split("").map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className="loader-letter inline-block translate-y-10 text-[clamp(1.5rem,7vw,4rem)] font-bold opacity-0"
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
