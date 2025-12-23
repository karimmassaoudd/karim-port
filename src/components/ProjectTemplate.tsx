import { ChevronDown } from "lucide-react";
import Image from "next/image";

type Props = {
  title: string;
  subtitle?: string;
  heroImage?: string;
  description?: string;
  children: React.ReactNode;
};

export default function ProjectTemplate({
  title,
  subtitle,
  heroImage,
  description,
  children,
}: Props) {
  return (
    <section className="reveal-section relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
        <div className="flex flex-col justify-center text-left">
          {subtitle ? (
            <p className="text-sm text-gray-500 mb-3 tracking-wider reveal-el">
              {subtitle}
            </p>
          ) : null}
          <h1 className="text-5xl md:text-6xl font-primary leading-tight reveal-el">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-gray-600 max-w-sm leading-relaxed reveal-el">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex justify-center items-center">
          {heroImage ? (
            <div className="w-full max-w-3xl pop-on-scroll">
              <Image
                src={heroImage}
                alt={title}
                width={1200}
                height={700}
                className="w-full h-auto rounded-xl shadow-xl"
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="scroll-cue text-[var(--accent)]" aria-hidden="true">
        <ChevronDown className="scroll-cue__icon" />
      </div>

      {/* Content */}
      <div className="prose text-gray-700 reveal-el">{children}</div>
    </section>
  );
}
