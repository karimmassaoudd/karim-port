"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import DarkVeil from "./DarkVeil";

export default function TravelWorldHoverSection() {
  const tiles = [
    {
      title: "Luxury Beach Getaways",
      subtitle: "Warm sands, calm seas",
      img: "/assets/travelworld_laptop_4k_transparent_crisp 1.png",
    },
    {
      title: "Mountain Adventures",
      subtitle: "Fresh air, scenic trails",
      img: "/assets/Travel World Second Section .png",
    },
    {
      title: "Cruise Experiences",
      subtitle: "Sail in style",
      img: "/assets/Travel World Second Section .png",
    },
  ];
  // Match the Home hero DarkVeil background color so look is identical
  const [backgroundColor, setBackgroundColor] = useState<
    [number, number, number]
  >([0.88, 0.87, 0.86]);

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

    // Respond to OS theme changes
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", updateBackground);

    // Respond to manual theme toggle (class changes on <html>)
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

  return (
    <section className="reveal-section group py-12 md:py-16 relative overflow-hidden">
      {/* Home-hero DarkVeil animation fades in on section hover */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-24 h-1 rounded-full bg-[var(--accent)] mb-6" />
        <h2 className="text-[var(--text)] font-primary text-3xl md:text-4xl mb-8">
          Explore by hovering
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((t) => (
            <div
              key={t.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-md bg-[var(--background)]"
            >
              <div className="relative w-full aspect-[16/10]">
                <Image
                  src={t.img}
                  alt={t.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              {/* hover veil */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* content */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                <div>
                  <p className="text-white/90 text-xs">{t.subtitle}</p>
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {t.title}
                  </h3>
                </div>
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 text-[var(--accent)] font-bold shadow">
                  ↗
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[var(--secondary-text)] text-sm mt-4">
          Hover the cards to reveal details.
        </p>
      </div>
    </section>
  );
}
