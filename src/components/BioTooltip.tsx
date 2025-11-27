"use client";

import { useState, useEffect, useRef } from "react";
import { Info } from "lucide-react";

interface BioTooltipProps {
  bio?: string;
  maxWords?: number; // Maximum number of words to display
}

export default function BioTooltip({ bio, maxWords = 30 }: BioTooltipProps) {
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Truncate bio to max words
  const truncateBio = (text: string, max: number) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= max) return text;
    return words.slice(0, max).join(" ") + "...";
  };

  // Auto-hide after 4 seconds on first load
  useEffect(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 4000); // 4 seconds

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsVisible(true);
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    // Hide after 0.5 seconds of leaving
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  const bioText = bio || "Crafting beautiful, responsive web experiences with modern technologies and creative design";
  const displayText = truncateBio(bioText, maxWords);

  return (
    <div className="absolute bottom-8 left-3 sm:bottom-12 sm:left-5 z-20 pointer-events-auto pl-2 sm:pl-4">
      {/* Message Bubble with Slide Animation */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          w-56 sm:w-64 md:w-72 lg:max-w-sm
          transition-all duration-500 ease-in-out ${
          isVisible
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 translate-y-12 invisible"
        }`}
      >
        <div className="px-4 py-3 sm:px-6 sm:py-4 rounded-lg bg-white/15 border border-white/25 backdrop-blur-md text-xs sm:text-sm md:text-base text-foreground shadow-lg">
          <p className="leading-relaxed break-words">{displayText}</p>
          
          {/* Arrow pointing down-left */}
          <div className="absolute bottom-0 left-4 sm:left-6 w-2 h-2 sm:w-3 sm:h-3 bg-white/15 border-b border-r border-white/25 rotate-45 transform translate-y-1 sm:translate-y-1.5" />
        </div>
      </div>

      {/* Icon Button - Always Visible */}
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative p-1.5 sm:p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all duration-300 cursor-help group mt-3 sm:mt-4"
        aria-label="About me"
      >
        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
        <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-pulse" />
      </button>
    </div>
  );
}
