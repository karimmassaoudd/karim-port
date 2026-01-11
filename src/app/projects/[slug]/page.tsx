"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageAnimator from "@/components/PageAnimator";
import { renderProjectSection } from "@/components/ProjectSectionRenderer";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects?slug=${resolvedParams.slug}`);
      const result = await response.json();

      if (result.success) {
        // Only show if published
        if (result.data.status === "published") {
          setProject(result.data);
        } else {
          router.push("/projects");
        }
      } else {
        router.push("/projects");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      router.push("/projects");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.slug, router]);

  useEffect(() => {
    fetchProject();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <>
        <Header />
        <PageAnimator>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
          </div>
          <Footer />
        </PageAnimator>
      </>
    );
  }

  if (!project) {
    return null;
  }

  const { sections, sectionOrder } = project;

  // Default section order if not specified
  const defaultSectionOrder = [
    "hero",
    "hoverExploration",
    "overview",
    "problemStatement",
    "solutions",
    "branding",
    "wireframes",
    "uiuxDesign",
    "developmentProcess",
    "websitePreview",
    "resultsImpact",
    "conclusion",
    "callToAction",
  ];

  const orderedSections = sectionOrder || defaultSectionOrder;

  return (
    <>
      <Header />
      <PageAnimator>
        <main className="min-h-screen bg-[var(--background)]">
          {/* Back Button */}
          <div className="container mx-auto px-6 pt-28 pb-8 max-w-6xl">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300 font-secondary"
            >
              <MdArrowBack size={20} />
              <span>Back to Projects</span>
            </Link>
          </div>

          {/* Dynamically Render Sections in Custom Order */}
          {orderedSections.map((sectionKey: string) =>
            renderProjectSection({
              sectionKey,
              section: sections[sectionKey],
              project,
            }),
          )}
        </main>
      </PageAnimator>
      <Footer />
    </>
  );
}
