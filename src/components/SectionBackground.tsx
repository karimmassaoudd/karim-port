/**
 * Reusable background blur effect component for sections
 */
export const SectionBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* Left blur */}
      <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[var(--accent)]/20 blur-3xl" />

      {/* Right blur */}
      <div className="absolute -right-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[var(--accent)]/18 blur-3xl" />
    </div>
  );
};

export default SectionBackground;
