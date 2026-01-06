"use client";
import { useState, useRef } from "react";
import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";

interface ImageCarouselProps {
  images: Array<{ url: string; alt: string }>;
  maxVisible?: number;
}

export default function ImageCarouselWithLightbox({
  images,
  maxVisible = 3,
}: ImageCarouselProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) return null;

  const imageWidth = 280;
  const gap = 16;
  const totalWidth = images.length * (imageWidth + gap);
  const maxScroll = Math.max(0, totalWidth - maxVisible * (imageWidth + gap));

  const scroll = (direction: "left" | "right") => {
    const scrollAmount = imageWidth + gap;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(maxScroll, scrollPosition + scrollAmount);
    setScrollPosition(newPosition);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxIndex === null) return;
    if (direction === "prev") {
      setLightboxIndex(
        lightboxIndex > 0 ? lightboxIndex - 1 : images.length - 1,
      );
    } else {
      setLightboxIndex(
        lightboxIndex < images.length - 1 ? lightboxIndex + 1 : 0,
      );
    }
  };

  return (
    <>
      {/* Carousel */}
      <div className="relative mt-8">
        <div className="relative overflow-hidden">
          {/* Scroll Left Button */}
          {scrollPosition > 0 && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--surface)] shadow-xl border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:bg-[var(--accent)] hover:text-white transition-all duration-200"
              aria-label="Scroll left"
            >
              <MdChevronLeft size={24} />
            </button>
          )}

          {/* Images Container */}
          <div
            ref={containerRef}
            className="flex gap-4 transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
            }}
          >
            {images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => openLightbox(idx)}
                className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group relative"
                style={{ width: `${imageWidth}px` }}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-lg">
                    Click to enlarge
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Scroll Right Button */}
          {scrollPosition < maxScroll && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--surface)] shadow-xl border border-[var(--border)] flex items-center justify-center text-[var(--text)] hover:bg-[var(--accent)] hover:text-white transition-all duration-200"
              aria-label="Scroll right"
            >
              <MdChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Image Counter */}
        {images.length > maxVisible && (
          <div className="text-center mt-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing {Math.min(maxVisible, images.length)} of {images.length}{" "}
              images • Scroll for more
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            aria-label="Close lightbox"
          >
            <MdClose size={28} />
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <MdChevronLeft size={32} />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-7xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            {images[lightboxIndex].alt && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white px-6 py-4 rounded-b-lg">
                <p className="text-center text-sm">
                  {images[lightboxIndex].alt}
                </p>
              </div>
            )}
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Next image"
            >
              <MdChevronRight size={32} />
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
