"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import {
  MdAdd,
  MdArrowBack,
  MdCheckCircle,
  MdCode,
  MdDelete,
  MdDesignServices,
  MdDragIndicator,
  MdDraw,
  MdHome,
  MdImage,
  MdInfo,
  MdLightbulb,
  MdPalette,
  MdPhone,
  MdPreview,
  MdSave,
  MdSwapVert,
  MdTrendingUp,
  MdWarning,
  MdTouchApp,
  MdFormatQuote,
  MdExplore,
  MdLocalOffer,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import SectionOrderManager from "@/components/admin/SectionOrderManager";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Toast = dynamic(() => import("@/components/Toast"), { ssr: false });

interface ProjectEditorProps {
  params: Promise<{ id: string }>;
}

// Sortable Navigation Item Component for Case Study Sections
function SortableNavItem({
  id,
  icon,
  label,
  isActive,
  isEnabled,
  onClick,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isEnabled?: boolean;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "z-50" : ""}>
      <button
        aria-label={`Navigate to ${label} section`}
        onClick={onClick}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group relative overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-white shadow-lg shadow-[var(--accent)]/20"
            : "text-[var(--text)] hover:bg-[var(--surface)]/50 hover:shadow-md"
        } ${isDragging ? "opacity-50" : ""}`}
      >
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
        )}

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing p-1 rounded transition-colors ${
            isActive
              ? "text-white/70 hover:text-white"
              : "text-[var(--text-secondary)] hover:text-[var(--accent)]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <MdDragIndicator className="w-4 h-4" />
        </div>

        {/* Icon */}
        <span
          className={`relative z-10 transition-transform duration-200 ${
            isActive ? "text-white" : "text-[var(--accent)]"
          }`}
        >
          {icon}
        </span>

        {/* Label */}
        <span
          className={`relative z-10 flex-1 text-sm font-semibold transition-all ${
            isActive ? "text-white" : "text-[var(--text)]"
          }`}
        >
          {label}
        </span>

        {/* Status Indicator */}
        {isEnabled !== undefined && (
          <span
            className={`relative z-10 w-2 h-2 rounded-full transition-all ${
              isEnabled
                ? "bg-green-400 shadow-lg shadow-green-400/50"
                : "bg-gray-500/50"
            }`}
          />
        )}
      </button>
    </div>
  );
}

// Navigation Item Component (for non-draggable items like Basic Info)
function NavItem({
  icon,
  label,
  isActive,
  isEnabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isEnabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Navigate to ${label} section`}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group relative overflow-hidden ${
        isActive
          ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-white shadow-lg shadow-[var(--accent)]/20 scale-[1.02]"
          : "text-[var(--text)] hover:bg-[var(--surface)]/50 hover:shadow-md hover:scale-[1.01] hover:border-[var(--border)]"
      }`}
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
      )}
      <span
        className={`relative z-10 transition-transform duration-200 ${isActive ? "text-white scale-110" : "text-[var(--accent)] group-hover:scale-110"}`}
      >
        {icon}
      </span>
      <span
        className={`relative z-10 flex-1 text-sm font-semibold transition-all ${isActive ? "text-white" : "text-[var(--text)]"}`}
      >
        {label}
      </span>
      {isEnabled !== undefined && (
        <span
          className={`relative z-10 w-2 h-2 rounded-full transition-all ${
            isEnabled
              ? "bg-green-400 shadow-lg shadow-green-400/50 animate-pulse"
              : "bg-gray-500/50"
          }`}
        />
      )}
    </button>
  );
}

export default function ProjectEditor({ params }: ProjectEditorProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Drag and drop sensors - must be at top level
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Helper function to safely parse JSON responses
  const safeJsonParse = async (response: Response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    if (!text || text.trim() === "") {
      throw new Error("Empty response from server");
    }
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("JSON parse error:", error, "Response text:", text);
      throw new Error("Invalid JSON response from server");
    }
  };

  // Separate state for section order to ensure drag-and-drop works correctly
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "hero",
    "hoverExploration",
    "overview",
    "quoteProcess",
    "problemStatement",
    "solutions",
    "themes",
    "branding",
    "wireframes",
    "uiuxDesign",
    "specialOffers",
    "developmentProcess",
    "websitePreview",
    "resultsImpact",
    "conclusion",
    "callToAction",
  ]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    thumbnail: { url: "", alt: "" },
    technologies: [] as string[],
    status: "draft" as "draft" | "published",
    featured: false,
    order: 0,
    sectionOrder: [
      "hero",
      "hoverExploration",
      "overview",
      "quoteProcess",
      "problemStatement",
      "solutions",
      "themes",
      "branding",
      "wireframes",
      "uiuxDesign",
      "specialOffers",
      "developmentProcess",
      "websitePreview",
      "resultsImpact",
      "conclusion",
      "callToAction",
    ] as string[],
    sections: {
      hero: {
        enabled: true,
        title: "",
        tagline: "",
        heroImage: { url: "", alt: "", caption: "" },
        category: "Web Development",
      },
      hoverExploration: {
        enabled: false,
        heading: "Explore by hovering",
        description: "",
        tiles: [] as Array<{
          title: string;
          subtitle: string;
          image: { url: string; alt: string };
        }>,
      },
      overview: {
        enabled: true,
        role: "",
        type: "",
        highlights: [] as string[],
        image: { url: "", alt: "" },
        // Legacy fields
        client: "",
        timeline: "",
        team: "",
        description: "",
        keyFeatures: [] as string[],
        overviewImage: { url: "", alt: "", caption: "" },
        subsections: [] as Array<{
          title: string;
          content: string;
          image?: { url: string; alt: string };
        }>,
      },
      quoteProcess: {
        enabled: false,
        quote: "",
        processCards: [] as Array<{
          title: string;
          icon: string;
          items: string[];
        }>,
        images: [] as any[],
      },
      problemStatement: {
        enabled: false,
        heading: "The Challenge",
        description: "",
        challenges: [] as string[],
        targetAudience: "",
        images: [] as any[],
      },
      solutions: {
        enabled: false,
        heading: "The Solutions",
        description: "",
        solutions: [] as any[],
        images: [] as any[],
      },
      branding: {
        enabled: false,
        heading: "Branding & Visual Direction",
        description: "",
        colorPalette: { primary: "", secondary: "" },
        typography: { primary: "", secondary: "" },
        logo: { url: "", alt: "", caption: "" },
        brandImages: [] as any[],
      },
      wireframes: {
        enabled: false,
        heading: "Wireframes",
        description: "",
        wireframes: [] as any[],
      },
      uiuxDesign: {
        enabled: false,
        heading: "UI/UX Design",
        description: "",
        designPrinciples: [] as string[],
        mockups: [] as any[],
        designNotes: "",
      },
      themes: {
        enabled: false,
        heading: "Themes",
        description: "",
        themes: [] as Array<{
          title: string;
          images: any[];
        }>,
      },
      developmentProcess: {
        enabled: false,
        heading: "Development Process",
        description: "",
        methodology: "",
        technicalChallenges: [] as string[],
        codeSnippets: [] as any[],
        images: [] as any[],
      },
      specialOffers: {
        enabled: false,
        heading: "Special Offers",
        description: "",
        offers: [] as Array<{
          title: string;
          subtitle: string;
          description: string;
          originalPrice: string;
          discountedPrice: string;
          discountBadge: string;
          buttonText: string;
          buttonLink: string;
        }>,
      },
      websitePreview: {
        enabled: false,
        heading: "Final Website",
        description: "",
        liveUrl: "",
        githubUrl: "",
        screenshots: [] as any[],
        videoUrl: "",
      },
      resultsImpact: {
        enabled: false,
        heading: "Results & Impact",
        description: "",
        metrics: [] as any[],
        testimonials: [] as any[],
        images: [] as any[],
      },
      conclusion: {
        enabled: false,
        heading: "Conclusion",
        description: "",
        lessonsLearned: [] as string[],
        futureImprovements: [] as string[],
      },
      callToAction: {
        enabled: false,
        heading: "Let's Work Together",
        description: "",
        primaryButtonText: "Contact Me",
        primaryButtonLink: "/contact",
        secondaryButtonText: "",
        secondaryButtonLink: "",
      },
    },
  });

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects?id=${resolvedParams.id}`);
      const result = await safeJsonParse(response);
      if (result.success) {
        const data = result.data;

        // Migrate old colorPalette array to new object format
        if (data.sections?.branding?.colorPalette) {
          if (Array.isArray(data.sections.branding.colorPalette)) {
            data.sections.branding.colorPalette = {
              primary: "",
              secondary: "",
            };
          } else if (typeof data.sections.branding.colorPalette !== "object") {
            data.sections.branding.colorPalette = {
              primary: "",
              secondary: "",
            };
          }
        }

        // Ensure heroImage exists
        if (!data.sections?.hero?.heroImage) {
          data.sections.hero.heroImage = { url: "", alt: "", caption: "" };
        }

        // Ensure logo exists
        if (!data.sections?.branding?.logo) {
          data.sections.branding.logo = { url: "", alt: "", caption: "" };
        }

        // Ensure sectionOrder exists with default order
        if (!data.sectionOrder || !Array.isArray(data.sectionOrder)) {
          data.sectionOrder = [
            "hero",
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
        }

        // Debug: Log overview data from server
        console.log("Fetched overview data:", data.sections?.overview);

        setFormData(data);
        // Sync section order state with loaded data
        if (data.sectionOrder && Array.isArray(data.sectionOrder)) {
          setSectionOrder(data.sectionOrder);
        }
      } else {
        showMessage("error", "Project not found");
        router.push("/admin/projects");
      }
    } catch (_error) {
      showMessage("error", "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id, router]);

  useEffect(() => {
    if (!isNew) {
      fetchProject();
    }
  }, [fetchProject, isNew]);

  const handleSave = async () => {
    if (!formData.title || !formData.shortDescription) {
      showMessage("error", "Title and description are required");
      return;
    }

    try {
      setSaving(true);
      const method = isNew ? "POST" : "PUT";
      const body = isNew ? formData : { ...formData, id: resolvedParams.id };

      const response = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await safeJsonParse(response);
      if (result.success) {
        showMessage("success", isNew ? "Project created!" : "Project updated!");
        if (isNew) {
          router.push(`/admin/projects/${result.data._id}`);
        }
      } else {
        showMessage("error", result.error || "Failed to save project");
      }
    } catch (_error) {
      showMessage("error", "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/projects/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await safeJsonParse(response);
      if (result.success && result.uploads && result.uploads.length > 0) {
        // Update the appropriate field with the first uploaded image
        const upload = result.uploads[0];
        updateNestedField(field, { url: upload.url, alt: upload.alt || file.name });
        showMessage("success", "Image uploaded! Remember to click 'Save Project' to persist changes.");
      } else {
        showMessage("error", result.error || "Upload failed");
      }
    } catch (_error) {
      showMessage("error", "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const updateNestedField = (path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split(".");
      // Use structured cloning instead of JSON.parse/stringify
      const newData = structuredClone(prev);
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const addArrayItem = (path: string, defaultValue: any) => {
    const current = getNestedValue(path);
    updateNestedField(path, [...(Array.isArray(current) ? current : []), defaultValue]);
  };

  const removeArrayItem = (path: string, index: number) => {
    const current = getNestedValue(path);
    if (!Array.isArray(current)) return;
    updateNestedField(
      path,
      current.filter((_: any, i: number) => i !== index),
    );
  };

  const getNestedValue = (path: string) => {
    return path.split(".").reduce((obj, key) => obj[key], formData as any);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Vertical Sidebar Navigation */}
      <aside className="w-72 bg-gradient-to-b from-[var(--surface)] to-[var(--background)] border-r border-[var(--border)]/50 h-screen sticky top-0 overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)]/50 bg-[var(--surface)]/80 backdrop-blur-sm">
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all duration-200 hover:gap-3 mb-6 group"
          >
            <MdArrowBack
              size={20}
              className="group-hover:transform group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">Back to Projects</span>
          </Link>
          <div className="bg-gradient-to-r from-[var(--accent)]/10 to-transparent p-3 rounded-lg border border-[var(--accent)]/20">
            <h2 className="text-lg font-bold text-[var(--text)] truncate mb-1">
              {formData.title || "Untitled Project"}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${isNew ? "bg-blue-400" : "bg-green-400"} animate-pulse`}
              ></span>
              {isNew ? "Creating new project" : "Editing project"}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <div className="space-y-2">
            <NavItem
              icon={<MdInfo size={18} />}
              label="Basic Info"
              isActive={activeTab === "basic"}
              onClick={() => setActiveTab("basic")}
            />

            {/* Divider */}
            <div className="pt-4 pb-2 px-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent"></div>
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  Case Study Sections
                </p>
                <div className="h-px flex-1 bg-gradient-to-l from-[var(--border)] to-transparent"></div>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs text-[var(--text-secondary)]">
                  Drag to reorder
                </p>
                <button
                  onClick={() => {
                    const defaultOrder = [
                      "hero",
                      "hoverExploration",
                      "overview",
                      "quoteProcess",
                      "problemStatement",
                      "solutions",
                      "tripThemes",
                      "branding",
                      "wireframes",
                      "uiuxDesign",
                      "specialOffers",
                      "developmentProcess",
                      "websitePreview",
                      "resultsImpact",
                      "conclusion",
                      "callToAction",
                    ];
                    setSectionOrder(defaultOrder);
                    setFormData((prev) => ({
                      ...prev,
                      sectionOrder: defaultOrder,
                    }));
                    showMessage("success", "Section order reset to default");
                  }}
                  className="text-xs px-2 py-1 rounded-md text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors flex items-center gap-1 border border-[var(--border)]"
                  title="Reset to default order"
                >
                  <MdSwapVert size={14} />
                  Reset
                </button>
              </div>
            </div>

            {/* Sortable Section List */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event: DragEndEvent) => {
                const { active, over } = event;
                if (over && active.id !== over.id) {
                  const oldIndex = sectionOrder.indexOf(active.id as string);
                  const newIndex = sectionOrder.indexOf(over.id as string);
                  const newOrder = arrayMove(
                    [...sectionOrder],
                    oldIndex,
                    newIndex,
                  );
                  console.log("🔄 Reordering sections:", {
                    from: active.id,
                    to: over.id,
                    oldIndex,
                    newIndex,
                    oldOrder: sectionOrder,
                    newOrder,
                  });
                  setSectionOrder(newOrder);
                  setFormData((prev) => ({ ...prev, sectionOrder: newOrder }));
                }
              }}
            >
              <SortableContext
                items={sectionOrder}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1.5">
                  {sectionOrder.map((sectionKey: string) => {
                    const sectionConfig: Record<
                      string,
                      { icon: React.ReactNode; label: string; tab: string }
                    > = {
                      hero: {
                        icon: <MdHome size={18} />,
                        label: "Hero",
                        tab: "hero",
                      },
                      hoverExploration: {
                        icon: <MdTouchApp size={18} />,
                        label: "Hover Tiles",
                        tab: "hoverExploration",
                      },
                      overview: {
                        icon: <MdInfo size={18} />,
                        label: "Overview",
                        tab: "overview",
                      },
                      quoteProcess: {
                        icon: <MdFormatQuote size={18} />,
                        label: "Quote/Process",
                        tab: "quoteProcess",
                      },
                      problemStatement: {
                        icon: <MdWarning size={18} />,
                        label: "Problem",
                        tab: "problem",
                      },
                      solutions: {
                        icon: <MdLightbulb size={18} />,
                        label: "Solutions",
                        tab: "solutions",
                      },
                      themes: {
                        icon: <MdExplore size={18} />,
                        label: "Themes",
                        tab: "themes",
                      },
                      branding: {
                        icon: <MdPalette size={18} />,
                        label: "Branding",
                        tab: "branding",
                      },
                      wireframes: {
                        icon: <MdDraw size={18} />,
                        label: "Wireframes",
                        tab: "wireframes",
                      },
                      uiuxDesign: {
                        icon: <MdDesignServices size={18} />,
                        label: "UI/UX",
                        tab: "uiux",
                      },
                      specialOffers: {
                        icon: <MdLocalOffer size={18} />,
                        label: "Special Offers",
                        tab: "specialOffers",
                      },
                      developmentProcess: {
                        icon: <MdCode size={18} />,
                        label: "Development",
                        tab: "development",
                      },
                      websitePreview: {
                        icon: <MdPreview size={18} />,
                        label: "Preview",
                        tab: "preview",
                      },
                      resultsImpact: {
                        icon: <MdTrendingUp size={18} />,
                        label: "Results",
                        tab: "results",
                      },
                      conclusion: {
                        icon: <MdCheckCircle size={18} />,
                        label: "Conclusion",
                        tab: "conclusion",
                      },
                      callToAction: {
                        icon: <MdPhone size={18} />,
                        label: "Call to Action",
                        tab: "cta",
                      },
                    };

                    const config = sectionConfig[sectionKey];
                    if (!config) return null;

                    return (
                      <SortableNavItem
                        key={sectionKey}
                        id={sectionKey}
                        icon={config.icon}
                        label={config.label}
                        isActive={activeTab === config.tab}
                        isEnabled={formData.sections[sectionKey]?.enabled}
                        onClick={() => setActiveTab(config.tab)}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)] to-[var(--surface)]/95 border-b border-[var(--border)]/50 backdrop-blur-xl shadow-lg">
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-[var(--text)]">
                    {isNew ? "Create Project" : "Edit Project"}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      formData.status === "published"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {formData.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] font-mono flex items-center gap-2">
                  <span className="text-[var(--accent)]">→</span>
                  {formData.slug
                    ? `/projects/${formData.slug}`
                    : "Set title to generate URL"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={
                  formData.status === "published" ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  updateNestedField(
                    "status",
                    formData.status === "published" ? "draft" : "published",
                  )
                }
                className="min-w-[120px] font-medium"
              >
                {formData.status === "published" ? "✓ Published" : "📝 Draft"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
                className="min-w-[140px] bg-[var(--accent)] hover:bg-[var(--accent)]/90 font-medium shadow-lg"
              >
                <MdSave size={20} className="mr-2" />
                {saving ? "Saving..." : "Save Project"}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[var(--background)]">
          <div className="max-w-5xl mx-auto px-8 py-10">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-[var(--surface)] to-[var(--surface)]/50 rounded-2xl border border-[var(--border)]/50 p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                      <MdInfo size={22} className="text-[var(--accent)]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text)]">
                      Basic Information
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                        <span>Project Title</span>
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }));
                          // Auto-generate slug
                          if (isNew) {
                            const slug = e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-+|-+$/g, "");
                            setFormData((prev) => ({ ...prev, slug }));
                          }
                        }}
                        className="w-full px-5 py-3 bg-[var(--background)] border-2 border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200 font-medium"
                        placeholder="My Awesome Project"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                        placeholder="my-awesome-project"
                      />
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        URL: /projects/{formData.slug || "project-slug"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">
                        Short Description *
                      </label>
                      <textarea
                        value={formData.shortDescription}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            shortDescription: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)] h-24"
                        placeholder="Brief description for project cards and listings"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">
                        Thumbnail Image
                      </label>
                      <div className="flex gap-4 items-start">
                        {formData.thumbnail.url && (
                          <img
                            src={formData.thumbnail.url}
                            alt="Thumbnail"
                            className="w-32 h-32 object-cover rounded-lg border border-[var(--border)]"
                          />
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "thumbnail")}
                            className="hidden"
                            id="thumbnail-upload"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() =>
                              document
                                .getElementById("thumbnail-upload")
                                ?.click()
                            }
                            disabled={uploading}
                          >
                            <MdImage size={18} />
                            {uploading ? "Uploading..." : "Upload Thumbnail"}
                          </Button>
                          <input
                            type="text"
                            value={formData.thumbnail.alt}
                            onChange={(e) =>
                              updateNestedField("thumbnail.alt", e.target.value)
                            }
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)] mt-2"
                            placeholder="Image alt text"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text)] mb-2">
                        Technologies
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="tech-input"
                            aria-label="Technology name"
                            className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                            placeholder="React, TypeScript, etc."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                if (input.value.trim()) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    technologies: [
                                      ...prev.technologies,
                                      input.value.trim(),
                                    ],
                                  }));
                                  input.value = "";
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition-colors flex items-center gap-1"
                            onClick={(e) => {
                              e.preventDefault();
                              const input = document.getElementById(
                                "tech-input",
                              ) as HTMLInputElement;
                              if (input && input.value.trim()) {
                                setFormData((prev) => ({
                                  ...prev,
                                  technologies: [
                                    ...prev.technologies,
                                    input.value.trim(),
                                  ],
                                }));
                                input.value = "";
                                input.focus();
                              }
                            }}
                          >
                            <MdAdd size={18} />
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm flex items-center gap-2"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setFormData((prev) => ({
                                    ...prev,
                                    technologies: prev.technologies.filter(
                                      (_, i) => i !== idx,
                                    ),
                                  }));
                                }}
                                className="hover:text-red-400 transition-colors"
                                aria-label={`Remove ${tech} technology`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              featured: e.target.checked,
                            }))
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-[var(--text)]">
                          Featured Project
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section Order Tab */}
            {activeTab === "sectionOrder" && (
              <SectionOrderManager
                sectionOrder={formData.sectionOrder || []}
                sections={formData.sections}
                onChange={(newOrder) => {
                  setFormData((prev) => ({
                    ...prev,
                    sectionOrder: newOrder,
                  }));
                }}
              />
            )}

            {/* Hero Section Tab */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      Hero Section
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.hero.enabled",
                          !formData.sections.hero.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        formData.sections.hero.enabled
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {formData.sections.hero.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.hero.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="hero-title"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="hero-title"
                          value={formData.sections.hero.title}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.hero.title",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="hero-tagline"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Tagline
                        </label>
                        <input
                          type="text"
                          id="hero-tagline"
                          value={formData.sections.hero.tagline}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.hero.tagline",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="hero-category"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Category
                        </label>
                        <input
                          type="text"
                          id="hero-category"
                          value={formData.sections.hero.category}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.hero.category",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Hero Image
                        </label>
                        {formData.sections.hero.heroImage?.url && (
                          <img
                            src={formData.sections.hero.heroImage.url}
                            alt="Hero"
                            className="w-full h-48 object-cover rounded-lg mb-2"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, "sections.hero.heroImage")
                          }
                          className="hidden"
                          id="hero-image"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() =>
                            document.getElementById("hero-image")?.click()
                          }
                          disabled={uploading}
                        >
                          <MdImage size={18} />
                          {uploading ? "Uploading..." : "Upload Hero Image"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Overview Section Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      Project Overview
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.overview.enabled",
                          !formData.sections.overview.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        formData.sections.overview.enabled
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {formData.sections.overview.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.overview.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="overview-role"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Role
                          </label>
                          <input
                            type="text"
                            id="overview-role"
                            value={formData.sections.overview.role || ""}
                            onChange={(e) =>
                              updateNestedField(
                                "sections.overview.role",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., UX/UI Design & Front-end"
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="overview-type"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Type
                          </label>
                          <input
                            type="text"
                            id="overview-type"
                            value={formData.sections.overview.type || ""}
                            onChange={(e) =>
                              updateNestedField(
                                "sections.overview.type",
                                e.target.value,
                              )
                            }
                            placeholder="e.g., Marketing Website (Travel)"
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Highlights
                        </label>
                        {(formData.sections.overview.highlights || []).map(
                          (highlight, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={highlight}
                                aria-label={`Highlight ${idx + 1}`}
                                onChange={(e) => {
                                  const newHighlights = [
                                    ...(formData.sections.overview.highlights || []),
                                  ];
                                  newHighlights[idx] = e.target.value;
                                  updateNestedField(
                                    "sections.overview.highlights",
                                    newHighlights,
                                  );
                                }}
                                placeholder="e.g., Destination cards"
                                className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                              />
                              <button
                                onClick={() =>
                                  removeArrayItem(
                                    "sections.overview.highlights",
                                    idx,
                                  )
                                }
                                className="text-red-400"
                                aria-label="Delete highlight"
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          ),
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addArrayItem("sections.overview.highlights", "")
                          }
                          className="flex items-center gap-2"
                        >
                          <MdAdd size={18} />
                          Add Highlight
                        </Button>
                      </div>

                      {/* Overview Image */}
                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Overview Image
                        </label>
                        <p className="text-xs text-[var(--text-secondary)] mb-3">
                          Main image for the overview section (like Travel World's bay photo)
                        </p>
                        {formData.sections.overview.image?.url && (
                          <img
                            src={formData.sections.overview.image.url}
                            alt="Overview"
                            className="w-full h-48 object-cover rounded-lg mb-2"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(
                              e,
                              "sections.overview.image",
                            )
                          }
                          className="hidden"
                          id="overview-image"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() =>
                            document.getElementById("overview-image")?.click()
                          }
                          disabled={uploading}
                        >
                          <MdImage size={18} />
                          {uploading ? "Uploading..." : "Upload Overview Image"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hover Exploration Section Tab */}
            {activeTab === "hoverExploration" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      Hover Exploration Section
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.hoverExploration.enabled",
                          !formData.sections.hoverExploration.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        formData.sections.hoverExploration.enabled
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {formData.sections.hoverExploration.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.hoverExploration.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="hover-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="hover-heading"
                          value={formData.sections.hoverExploration.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.hoverExploration.heading",
                              e.target.value,
                            )
                          }
                          placeholder="Explore by hovering"
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="hover-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description (optional)
                        </label>
                        <textarea
                          id="hover-description"
                          value={formData.sections.hoverExploration.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.hoverExploration.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-20"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-[var(--text)]">
                            Hover Tiles
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addArrayItem("sections.hoverExploration.tiles", {
                                title: "",
                                subtitle: "",
                                image: { url: "", alt: "" },
                              })
                            }
                          >
                            <MdAdd size={18} /> Add Tile
                          </Button>
                        </div>

                        {formData.sections.hoverExploration.tiles?.map(
                          (tile: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4 mb-3"
                            >
                              <div className="space-y-3">
                                <div>
                                  <label
                                    htmlFor={`hover-tile-title-${idx}`}
                                    className="block text-xs font-medium text-[var(--text)] mb-1"
                                  >
                                    Title
                                  </label>
                                  <input
                                    type="text"
                                    id={`hover-tile-title-${idx}`}
                                    value={tile.title}
                                    onChange={(e) => {
                                      const tiles = [
                                        ...formData.sections.hoverExploration
                                          .tiles,
                                      ];
                                      tiles[idx] = {
                                        ...tiles[idx],
                                        title: e.target.value,
                                      };
                                      updateNestedField(
                                        "sections.hoverExploration.tiles",
                                        tiles,
                                      );
                                    }}
                                    placeholder="e.g., Luxury Beach Getaways"
                                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor={`hover-tile-subtitle-${idx}`}
                                    className="block text-xs font-medium text-[var(--text)] mb-1"
                                  >
                                    Subtitle
                                  </label>
                                  <input
                                    type="text"
                                    id={`hover-tile-subtitle-${idx}`}
                                    value={tile.subtitle}
                                    onChange={(e) => {
                                      const tiles = [
                                        ...formData.sections.hoverExploration
                                          .tiles,
                                      ];
                                      tiles[idx] = {
                                        ...tiles[idx],
                                        subtitle: e.target.value,
                                      };
                                      updateNestedField(
                                        "sections.hoverExploration.tiles",
                                        tiles,
                                      );
                                    }}
                                    placeholder="e.g., Warm sands, calm seas"
                                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-[var(--text)] mb-1">
                                    Image
                                  </label>
                                  {tile.image?.url && (
                                    <img
                                      src={tile.image.url}
                                      alt={tile.image.alt}
                                      className="w-full h-32 object-cover rounded mb-2"
                                    />
                                  )}
                                  <div className="flex gap-2">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        await handleImageUpload(
                                          e,
                                          `sections.hoverExploration.tiles.${idx}.image`,
                                        );
                                      }}
                                      className="hidden"
                                      id={`hover-tile-${idx}`}
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      type="button"
                                      onClick={() =>
                                        document
                                          .getElementById(`hover-tile-${idx}`)
                                          ?.click()
                                      }
                                      disabled={uploading}
                                    >
                                      <MdImage size={16} />
                                      {tile.image?.url ? "Change" : "Upload"}
                                    </Button>
                                    <button
                                      onClick={() =>
                                        removeArrayItem(
                                          "sections.hoverExploration.tiles",
                                          idx,
                                        )
                                      }
                                      className="text-red-400 hover:text-red-500"
                                      aria-label="Delete hover tile"
                                    >
                                      <MdDelete size={20} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Problem Statement Tab */}
            {activeTab === "problem" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      Problem Statement
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.problemStatement.enabled",
                          !formData.sections.problemStatement.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        formData.sections.problemStatement.enabled
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {formData.sections.problemStatement.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.problemStatement.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="problem-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="problem-heading"
                          value={formData.sections.problemStatement.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.problemStatement.heading",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          placeholder="The Challenge"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="problem-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="problem-description"
                          value={formData.sections.problemStatement.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.problemStatement.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                          placeholder="Describe the challenge..."
                        />
                      </div>

                      {/* Image Gallery */}
                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Image Gallery
                        </label>
                        <p className="text-xs text-[var(--text-secondary)] mb-3">
                          Add images to illustrate the problem. Max 3 visible at
                          once with slide carousel for more.
                        </p>

                        {/* Display existing images */}
                        {formData.sections.problemStatement.images?.map(
                          (image, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 mb-2 p-2 border border-[var(--border)] rounded-lg"
                            >
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <input
                                type="text"
                                value={image.alt || ""}
                                aria-label={`Image ${idx + 1} description`}
                                onChange={(e) => {
                                  const newImages = [
                                    ...(formData.sections.problemStatement
                                      .images || []),
                                  ];
                                  newImages[idx] = {
                                    ...newImages[idx],
                                    alt: e.target.value,
                                  };
                                  updateNestedField(
                                    "sections.problemStatement.images",
                                    newImages,
                                  );
                                }}
                                placeholder="Image description"
                                className="flex-1 px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--text)]"
                              />
                              <button
                                onClick={() => {
                                  const newImages =
                                    formData.sections.problemStatement.images?.filter(
                                      (_, i) => i !== idx,
                                    );
                                  updateNestedField(
                                    "sections.problemStatement.images",
                                    newImages,
                                  );
                                }}
                                className="text-red-400 hover:text-red-500"
                                aria-label="Delete image"
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          ),
                        )}

                        {/* Upload new images (multiple) */}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length === 0) return;

                            setUploading(true);
                            const fd = new FormData();
                            files.forEach((file) => fd.append("file", file));

                            try {
                              const response = await fetch(
                                "/api/projects/upload-image",
                                {
                                  method: "POST",
                                  body: fd,
                                },
                              );
                              const result = await safeJsonParse(response);

                              if (result.success) {
                                const currentImages = [
                                  ...(formData.sections.problemStatement
                                    .images || []),
                                ];

                                // Add all uploaded images
                                result.uploads.forEach((upload: any) => {
                                  currentImages.push({
                                    url: upload.url,
                                    alt: upload.alt || upload.filename,
                                  });
                                });

                                updateNestedField(
                                  "sections.problemStatement.images",
                                  currentImages,
                                );

                                showMessage(
                                  "success",
                                  result.message ||
                                    `${files.length} images uploaded!`,
                                );

                                if (result.errors && result.errors.length > 0) {
                                  console.warn(
                                    "Some uploads failed:",
                                    result.errors,
                                  );
                                }
                              } else {
                                showMessage(
                                  "error",
                                  result.error || "Upload failed",
                                );
                              }
                            } catch (error) {
                              console.error("Upload error:", error);
                              showMessage("error", "Upload failed");
                            } finally {
                              setUploading(false);
                            }
                            e.target.value = "";
                          }}
                          className="hidden"
                          id="problem-image-upload"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() =>
                            document
                              .getElementById("problem-image-upload")
                              ?.click()
                          }
                          disabled={uploading}
                        >
                          <MdAdd size={18} />
                          {uploading ? "Uploading..." : "Add Images (Multiple)"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other sections follow similar pattern - adding placeholders for brevity */}
            {activeTab === "solutions" && (
              <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[var(--text)]">
                    Solutions Section
                  </h2>
                  <button
                    onClick={() =>
                      updateNestedField(
                        "sections.solutions.enabled",
                        !formData.sections.solutions.enabled,
                      )
                    }
                    className={`px-3 py-1 rounded-lg text-sm ${formData.sections.solutions.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                  >
                    {formData.sections.solutions.enabled
                      ? "Enabled"
                      : "Disabled"}
                  </button>
                </div>
                {formData.sections.solutions.enabled && (
                  <textarea
                    value={formData.sections.solutions.description}
                    aria-label="Solutions description"
                    onChange={(e) =>
                      updateNestedField(
                        "sections.solutions.description",
                        e.target.value,
                      )
                    }
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                  />
                )}
              </div>
            )}

            {/* Quote/Process Section Tab */}
            {activeTab === "quoteProcess" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      Quote & Process Section
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.quoteProcess.enabled",
                          !formData.sections.quoteProcess.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        formData.sections.quoteProcess.enabled
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {formData.sections.quoteProcess.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.quoteProcess.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="quote-text"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Quote
                        </label>
                        <textarea
                          id="quote-text"
                          value={formData.sections.quoteProcess.quote}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.quoteProcess.quote",
                              e.target.value,
                            )
                          }
                          placeholder="Make exploring destinations fun and effortless."
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-24"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-[var(--text)]">
                            Process Cards
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addArrayItem(
                                "sections.quoteProcess.processCards",
                                {
                                  title: "",
                                  icon: "",
                                  items: [],
                                },
                              )
                            }
                          >
                            <MdAdd size={18} /> Add Card
                          </Button>
                        </div>

                        {formData.sections.quoteProcess.processCards?.map(
                          (card: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4 mb-3"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={card.title}
                                    aria-label={`Process card ${idx + 1} title`}
                                    onChange={(e) => {
                                      const cards = [
                                        ...formData.sections.quoteProcess
                                          .processCards,
                                      ];
                                      cards[idx] = {
                                        ...cards[idx],
                                        title: e.target.value,
                                      };
                                      updateNestedField(
                                        "sections.quoteProcess.processCards",
                                        cards,
                                      );
                                    }}
                                    placeholder="e.g., What I did"
                                    className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                  />
                                  <button
                                    onClick={() =>
                                      removeArrayItem(
                                        "sections.quoteProcess.processCards",
                                        idx,
                                      )
                                    }
                                    className="text-red-400 hover:text-red-500"
                                    aria-label="Delete process card"
                                  >
                                    <MdDelete size={20} />
                                  </button>
                                </div>
                                <div>
                                  <label
                                    htmlFor={`process-card-items-${idx}`}
                                    className="block text-xs font-medium text-[var(--text)] mb-1"
                                  >
                                    Items (one per line)
                                  </label>
                                  <textarea
                                    id={`process-card-items-${idx}`}
                                    value={card.items?.join("\n") || ""}
                                    onChange={(e) => {
                                      const cards = [
                                        ...formData.sections.quoteProcess
                                          .processCards,
                                      ];
                                      cards[idx] = {
                                        ...cards[idx],
                                        items: e.target.value
                                          .split("\n")
                                          .filter((item) => item.trim()),
                                      };
                                      updateNestedField(
                                        "sections.quoteProcess.processCards",
                                        cards,
                                      );
                                    }}
                                    placeholder="Designed reusable destination cards&#10;Structured special offers&#10;Clear CTAs"
                                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm h-24"
                                  />
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Images (optional)
                        </label>
                        {formData.sections.quoteProcess.images?.map(
                          (image: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 mb-2 p-2 border border-[var(--border)] rounded-lg"
                            >
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <button
                                onClick={() => {
                                  const newImages =
                                    formData.sections.quoteProcess.images?.filter(
                                      (_: any, i: number) => i !== idx,
                                    );
                                  updateNestedField(
                                    "sections.quoteProcess.images",
                                    newImages,
                                  );
                                }}
                                className="text-red-400 hover:text-red-500"
                                aria-label="Delete image"
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          ),
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length === 0) return;
                            setUploading(true);
                            const fd = new FormData();
                            files.forEach((file) => fd.append("file", file));
                            try {
                              const response = await fetch(
                                "/api/projects/upload-image",
                                {
                                  method: "POST",
                                  body: fd,
                                },
                              );
                              const result = await safeJsonParse(response);
                              if (result.success) {
                                const currentImages = [
                                  ...(formData.sections.quoteProcess.images ||
                                    []),
                                ];
                                result.uploads.forEach((upload: any) => {
                                  currentImages.push({
                                    url: upload.url,
                                    alt: upload.alt || upload.filename,
                                  });
                                });
                                updateNestedField(
                                  "sections.quoteProcess.images",
                                  currentImages,
                                );
                                showMessage("success", "Images uploaded!");
                              }
                            } finally {
                              setUploading(false);
                            }
                            e.target.value = "";
                          }}
                          className="hidden"
                          id="quote-process-images"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() =>
                            document
                              .getElementById("quote-process-images")
                              ?.click()
                          }
                          disabled={uploading}
                        >
                          <MdAdd size={18} />
                          {uploading ? "Uploading..." : "Add Images"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Themes Section Tab */}
            {activeTab === "themes" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      Themes Section
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.themes.enabled",
                          !formData.sections.themes.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        formData.sections.themes.enabled
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {formData.sections.themes.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.themes.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="themes-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="themes-heading"
                          value={formData.sections.themes.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.themes.heading",
                              e.target.value,
                            )
                          }
                          placeholder="Themes"
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="themes-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description (optional)
                        </label>
                        <textarea
                          id="themes-description"
                          value={formData.sections.themes.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.themes.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-20"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-[var(--text)]">
                            Themes
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addArrayItem("sections.themes.themes", {
                                title: "",
                                images: [],
                              })
                            }
                          >
                            <MdAdd size={18} /> Add Theme
                          </Button>
                        </div>

                        {formData.sections.themes.themes?.map(
                          (theme: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4 mb-3"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                  <input
                                    type="text"
                                    value={theme.title}
                                    aria-label={`Theme ${idx + 1} title`}
                                    onChange={(e) => {
                                      const themes = [
                                        ...formData.sections.themes.themes,
                                      ];
                                      themes[idx] = {
                                        ...themes[idx],
                                        title: e.target.value,
                                      };
                                      updateNestedField(
                                        "sections.themes.themes",
                                        themes,
                                      );
                                    }}
                                    placeholder="e.g., Luxury Beach Getaways"
                                    className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                  />
                                  <button
                                    onClick={() =>
                                      removeArrayItem(
                                        "sections.themes.themes",
                                        idx,
                                      )
                                    }
                                    className="text-red-400 hover:text-red-500"
                                    aria-label="Delete theme"
                                  >
                                    <MdDelete size={20} />
                                  </button>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-[var(--text)] mb-2">
                                    Theme Images
                                  </label>

                                  {/* Display existing images */}
                                  {theme.images?.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                      {theme.images.map(
                                        (img: any, imgIdx: number) => (
                                          <div
                                            key={imgIdx}
                                            className="relative group"
                                          >
                                            <img
                                              src={img.url}
                                              alt={
                                                img.alt ||
                                                `Theme image ${imgIdx + 1}`
                                              }
                                              className="w-full h-24 object-cover rounded border border-[var(--border)]"
                                            />
                                            <button
                                              onClick={() => {
                                                const themes = [
                                                  ...formData.sections.themes
                                                    .themes,
                                                ];
                                                themes[idx].images = themes[
                                                  idx
                                                ].images.filter(
                                                  (_: any, i: number) =>
                                                    i !== imgIdx,
                                                );
                                                updateNestedField(
                                                  "sections.themes.themes",
                                                  themes,
                                                );
                                              }}
                                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                              aria-label="Delete theme image"
                                            >
                                              <MdDelete size={14} />
                                            </button>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}

                                  {/* Upload new images */}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={async (e) => {
                                      const files = Array.from(
                                        e.target.files || [],
                                      );
                                      if (files.length === 0) return;

                                      setUploading(true);
                                      const fd = new FormData();
                                      files.forEach((file) =>
                                        fd.append("file", file),
                                      );

                                      try {
                                        const response = await fetch(
                                          "/api/projects/upload-image",
                                          {
                                            method: "POST",
                                            body: fd,
                                          },
                                        );
                                        const result =
                                          await safeJsonParse(response);

                                        if (result.success) {
                                          const themes = [
                                            ...formData.sections.themes.themes,
                                          ];
                                          const currentImages =
                                            themes[idx].images || [];

                                          result.uploads.forEach(
                                            (upload: any) => {
                                              currentImages.push({
                                                url: upload.url,
                                                alt:
                                                  upload.alt || upload.filename,
                                              });
                                            },
                                          );

                                          themes[idx].images = currentImages;
                                          updateNestedField(
                                            "sections.themes.themes",
                                            themes,
                                          );
                                          showMessage(
                                            "success",
                                            "Images uploaded!",
                                          );
                                        }
                                      } catch (error) {
                                        showMessage("error", "Upload failed");
                                      } finally {
                                        setUploading(false);
                                      }
                                      e.target.value = "";
                                    }}
                                    className="hidden"
                                    id={`theme-images-${idx}`}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onClick={() =>
                                      document
                                        .getElementById(`theme-images-${idx}`)
                                        ?.click()
                                    }
                                    disabled={uploading}
                                  >
                                    <MdAdd size={16} />
                                    {uploading
                                      ? "Uploading..."
                                      : "Add Images to Theme"}
                                  </Button>
                                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                                    Upload multiple images for this theme. They
                                    will rotate in a carousel.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Special Offers Section Tab */}
            {activeTab === "specialOffers" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      Special Offers Section
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.specialOffers.enabled",
                          !formData.sections.specialOffers.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        formData.sections.specialOffers.enabled
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {formData.sections.specialOffers.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.specialOffers.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="offers-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="offers-heading"
                          value={formData.sections.specialOffers.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.specialOffers.heading",
                              e.target.value,
                            )
                          }
                          placeholder="Special Offers"
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="offers-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description (optional)
                        </label>
                        <textarea
                          id="offers-description"
                          value={formData.sections.specialOffers.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.specialOffers.description",
                              e.target.value,
                            )
                          }
                          placeholder="Take advantage of our limited-time deals..."
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-20"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-[var(--text)]">
                            Offers
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addArrayItem("sections.specialOffers.offers", {
                                title: "",
                                subtitle: "",
                                description: "",
                                originalPrice: "",
                                discountedPrice: "",
                                discountBadge: "",
                                buttonText: "Book Now",
                                buttonLink: "",
                              })
                            }
                          >
                            <MdAdd size={18} /> Add Offer
                          </Button>
                        </div>

                        {formData.sections.specialOffers.offers?.map(
                          (offer: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4 mb-3"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <h4 className="text-sm font-semibold text-[var(--text)]">
                                    Offer #{idx + 1}
                                  </h4>
                                  <button
                                    onClick={() =>
                                      removeArrayItem(
                                        "sections.specialOffers.offers",
                                        idx,
                                      )
                                    }
                                    className="text-red-400 hover:text-red-500"
                                    aria-label="Delete special offer"
                                  >
                                    <MdDelete size={20} />
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label
                                      htmlFor={`offer-title-${idx}`}
                                      className="block text-xs font-medium text-[var(--text)] mb-1"
                                    >
                                      Title
                                    </label>
                                    <input
                                      type="text"
                                      id={`offer-title-${idx}`}
                                      value={offer.title}
                                      onChange={(e) => {
                                        const offers = [
                                          ...formData.sections.specialOffers
                                            .offers,
                                        ];
                                        offers[idx] = {
                                          ...offers[idx],
                                          title: e.target.value,
                                        };
                                        updateNestedField(
                                          "sections.specialOffers.offers",
                                          offers,
                                        );
                                      }}
                                      placeholder="Summer Escape to Bali"
                                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`offer-subtitle-${idx}`}
                                      className="block text-xs font-medium text-[var(--text)] mb-1"
                                    >
                                      Subtitle
                                    </label>
                                    <input
                                      type="text"
                                      id={`offer-subtitle-${idx}`}
                                      value={offer.subtitle}
                                      onChange={(e) => {
                                        const offers = [
                                          ...formData.sections.specialOffers
                                            .offers,
                                        ];
                                        offers[idx] = {
                                          ...offers[idx],
                                          subtitle: e.target.value,
                                        };
                                        updateNestedField(
                                          "sections.specialOffers.offers",
                                          offers,
                                        );
                                      }}
                                      placeholder="7 nights luxury resort"
                                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label
                                    htmlFor={`offer-description-${idx}`}
                                    className="block text-xs font-medium text-[var(--text)] mb-1"
                                  >
                                    Description
                                  </label>
                                  <textarea
                                    id={`offer-description-${idx}`}
                                    value={offer.description}
                                    onChange={(e) => {
                                      const offers = [
                                        ...formData.sections.specialOffers
                                          .offers,
                                      ];
                                      offers[idx] = {
                                        ...offers[idx],
                                        description: e.target.value,
                                      };
                                      updateNestedField(
                                        "sections.specialOffers.offers",
                                        offers,
                                      );
                                    }}
                                    placeholder="Luxury beachfront resort with daily breakfast..."
                                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm h-16"
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label
                                      htmlFor={`offer-original-price-${idx}`}
                                      className="block text-xs font-medium text-[var(--text)] mb-1"
                                    >
                                      Original Price
                                    </label>
                                    <input
                                      type="text"
                                      id={`offer-original-price-${idx}`}
                                      value={offer.originalPrice}
                                      onChange={(e) => {
                                        const offers = [
                                          ...formData.sections.specialOffers
                                            .offers,
                                        ];
                                        offers[idx] = {
                                          ...offers[idx],
                                          originalPrice: e.target.value,
                                        };
                                        updateNestedField(
                                          "sections.specialOffers.offers",
                                          offers,
                                        );
                                      }}
                                      placeholder="$1,199"
                                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`offer-discounted-price-${idx}`}
                                      className="block text-xs font-medium text-[var(--text)] mb-1"
                                    >
                                      Discounted Price
                                    </label>
                                    <input
                                      type="text"
                                      id={`offer-discounted-price-${idx}`}
                                      value={offer.discountedPrice}
                                      onChange={(e) => {
                                        const offers = [
                                          ...formData.sections.specialOffers
                                            .offers,
                                        ];
                                        offers[idx] = {
                                          ...offers[idx],
                                          discountedPrice: e.target.value,
                                        };
                                        updateNestedField(
                                          "sections.specialOffers.offers",
                                          offers,
                                        );
                                      }}
                                      placeholder="$899"
                                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`offer-discount-badge-${idx}`}
                                      className="block text-xs font-medium text-[var(--text)] mb-1"
                                    >
                                      Discount Badge
                                    </label>
                                    <input
                                      type="text"
                                      id={`offer-discount-badge-${idx}`}
                                      value={offer.discountBadge}
                                      onChange={(e) => {
                                        const offers = [
                                          ...formData.sections.specialOffers
                                            .offers,
                                        ];
                                        offers[idx] = {
                                          ...offers[idx],
                                          discountBadge: e.target.value,
                                        };
                                        updateNestedField(
                                          "sections.specialOffers.offers",
                                          offers,
                                        );
                                      }}
                                      placeholder="Save 25%"
                                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label
                                      htmlFor={`offer-button-text-${idx}`}
                                      className="block text-xs font-medium text-[var(--text)] mb-1"
                                    >
                                      Button Text
                                    </label>
                                    <input
                                      type="text"
                                      id={`offer-button-text-${idx}`}
                                      value={offer.buttonText}
                                      onChange={(e) => {
                                        const offers = [
                                          ...formData.sections.specialOffers
                                            .offers,
                                        ];
                                        offers[idx] = {
                                          ...offers[idx],
                                          buttonText: e.target.value,
                                        };
                                        updateNestedField(
                                          "sections.specialOffers.offers",
                                          offers,
                                        );
                                      }}
                                      placeholder="Book Now"
                                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`offer-button-link-${idx}`}
                                      className="block text-xs font-medium text-[var(--text)] mb-1"
                                    >
                                      Button Link
                                    </label>
                                    <input
                                      type="text"
                                      id={`offer-button-link-${idx}`}
                                      value={offer.buttonLink}
                                      onChange={(e) => {
                                        const offers = [
                                          ...formData.sections.specialOffers
                                            .offers,
                                        ];
                                        offers[idx] = {
                                          ...offers[idx],
                                          buttonLink: e.target.value,
                                        };
                                        updateNestedField(
                                          "sections.specialOffers.offers",
                                          offers,
                                        );
                                      }}
                                      placeholder="/contact"
                                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text)] text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Branding Section */}
            {activeTab === "branding" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      BRANDING SECTION
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.branding.enabled",
                          !formData.sections.branding.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.branding.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {formData.sections.branding.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.branding.enabled && (
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="branding-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="branding-heading"
                          value={formData.sections.branding.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.branding.heading",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                          placeholder="Brand Identity"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="branding-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="branding-description"
                          value={formData.sections.branding.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.branding.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32 focus:outline-none focus:border-[var(--accent)]"
                          placeholder="Describe the branding approach..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Logo
                        </label>
                        {formData.sections.branding.logo?.url && (
                          <img
                            src={formData.sections.branding.logo.url}
                            alt="Logo"
                            className="w-48 h-48 object-contain bg-gray-100 dark:bg-gray-800 rounded-lg mb-2 p-4"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, "sections.branding.logo")
                          }
                          className="hidden"
                          id="logo-upload"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() =>
                            document.getElementById("logo-upload")?.click()
                          }
                          disabled={uploading}
                        >
                          <MdImage size={18} />
                          {uploading ? "Uploading..." : "Upload Logo"}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="branding-primary-color"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Primary Color
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              id="branding-primary-color"
                              value={
                                formData.sections.branding.colorPalette
                                  ?.primary || "#000000"
                              }
                              onChange={(e) =>
                                updateNestedField(
                                  "sections.branding.colorPalette.primary",
                                  e.target.value,
                                )
                              }
                              className="w-16 h-10 rounded border border-[var(--border)] cursor-pointer"
                              aria-label="Primary color picker"
                            />
                            <input
                              type="text"
                              value={
                                formData.sections.branding.colorPalette
                                  ?.primary || "#000000"
                              }
                              onChange={(e) =>
                                updateNestedField(
                                  "sections.branding.colorPalette.primary",
                                  e.target.value,
                                )
                              }
                              placeholder="#000000"
                              aria-label="Primary color hex value"
                              className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="branding-secondary-color"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Secondary Color
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              id="branding-secondary-color"
                              value={
                                formData.sections.branding.colorPalette
                                  ?.secondary || "#000000"
                              }
                              onChange={(e) =>
                                updateNestedField(
                                  "sections.branding.colorPalette.secondary",
                                  e.target.value,
                                )
                              }
                              className="w-16 h-10 rounded border border-[var(--border)] cursor-pointer"
                              aria-label="Secondary color picker"
                            />
                            <input
                              type="text"
                              value={
                                formData.sections.branding.colorPalette
                                  ?.secondary || "#000000"
                              }
                              onChange={(e) =>
                                updateNestedField(
                                  "sections.branding.colorPalette.secondary",
                                  e.target.value,
                                )
                              }
                              placeholder="#000000"
                              aria-label="Secondary color hex value"
                              className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="branding-primary-font"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Primary Font
                          </label>
                          <input
                            type="text"
                            id="branding-primary-font"
                            value={
                              formData.sections.branding.typography?.primary ||
                              ""
                            }
                            onChange={(e) =>
                              updateNestedField(
                                "sections.branding.typography.primary",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                            placeholder="Poppins, Inter..."
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="branding-secondary-font"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Secondary Font
                          </label>
                          <input
                            type="text"
                            id="branding-secondary-font"
                            value={
                              formData.sections.branding.typography
                                ?.secondary || ""
                            }
                            onChange={(e) =>
                              updateNestedField(
                                "sections.branding.typography.secondary",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                            placeholder="Roboto, Open Sans..."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wireframes Section */}
            {activeTab === "wireframes" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      WIREFRAMES SECTION
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.wireframes.enabled",
                          !formData.sections.wireframes.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.wireframes.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {formData.sections.wireframes.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.wireframes.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="wireframes-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="wireframes-heading"
                          value={formData.sections.wireframes.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.wireframes.heading",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          placeholder="Wireframes & Sketches"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="wireframes-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="wireframes-description"
                          value={formData.sections.wireframes.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.wireframes.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                          placeholder="Describe the wireframing process..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Wireframe Images
                        </label>
                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                          Add multiple wireframe screenshots
                        </p>

                        {/* Display existing wireframe images */}
                        {formData.sections.wireframes.wireframes?.map(
                          (image, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 mb-2 p-2 border border-[var(--border)] rounded-lg"
                            >
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <input
                                type="text"
                                value={image.alt}
                                aria-label={`Wireframe ${idx + 1} description`}
                                onChange={(e) => {
                                  const newImages = [
                                    ...(formData.sections.wireframes
                                      .wireframes || []),
                                  ];
                                  newImages[idx] = {
                                    ...newImages[idx],
                                    alt: e.target.value,
                                  };
                                  updateNestedField(
                                    "sections.wireframes.wireframes",
                                    newImages,
                                  );
                                }}
                                placeholder="Image description"
                                className="flex-1 px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--text)]"
                              />
                              <button
                                onClick={() => {
                                  const newImages =
                                    formData.sections.wireframes.wireframes?.filter(
                                      (_, i) => i !== idx,
                                    );
                                  updateNestedField(
                                    "sections.wireframes.wireframes",
                                    newImages,
                                  );
                                }}
                                className="text-red-400 hover:text-red-500"
                                aria-label="Delete wireframe image"
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          ),
                        )}

                        {/* Upload new wireframe image */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setUploading(true);
                            const uploadFormData = new FormData();
                            uploadFormData.append("file", file);

                            try {
                              const response = await fetch(
                                "/api/projects/upload-image",
                                {
                                  method: "POST",
                                  body: uploadFormData,
                                },
                              );
                              const result = await safeJsonParse(response);

                              if (result.success) {
                                const currentImages = [
                                  ...(formData.sections.wireframes.wireframes ||
                                    []),
                                ];
                                currentImages.push({
                                  url: result.url,
                                  alt: file.name,
                                });
                                updateNestedField(
                                  "sections.wireframes.wireframes",
                                  currentImages,
                                );
                                showMessage("success", "Image uploaded!");
                              } else {
                                showMessage(
                                  "error",
                                  result.error || "Upload failed",
                                );
                              }
                            } catch (error) {
                              console.error("Upload error:", error);
                              showMessage("error", "Upload failed");
                            } finally {
                              setUploading(false);
                            }
                            e.target.value = "";
                          }}
                          className="hidden"
                          id="wireframe-upload"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() =>
                            document.getElementById("wireframe-upload")?.click()
                          }
                          disabled={uploading}
                        >
                          <MdAdd size={18} />
                          {uploading ? "Uploading..." : "Add Wireframe Image"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* UI/UX Section */}
            {activeTab === "uiux" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      UI/UX DESIGN SECTION
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.uiuxDesign.enabled",
                          !formData.sections.uiuxDesign.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.uiuxDesign.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {formData.sections.uiuxDesign.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.uiuxDesign.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="uiux-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="uiux-heading"
                          value={formData.sections.uiuxDesign.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.uiuxDesign.heading",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          placeholder="UI/UX Design"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="uiux-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="uiux-description"
                          value={formData.sections.uiuxDesign.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.uiuxDesign.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                          placeholder="Describe the design decisions..."
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="uiux-design-tool"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Design Tool
                        </label>
                        <input
                          type="text"
                          id="uiux-design-tool"
                          value={formData.sections.uiuxDesign.designTool || ""}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.uiuxDesign.designTool",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          placeholder="Figma, Adobe XD, Sketch..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Design Mockups
                        </label>
                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                          Add UI/UX design screenshots
                        </p>

                        {/* Display existing mockups */}
                        {formData.sections.uiuxDesign.mockups?.map(
                          (mockup, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 mb-2 p-2 border border-[var(--border)] rounded-lg"
                            >
                              <img
                                src={mockup.url}
                                alt={mockup.alt}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <input
                                type="text"
                                value={mockup.alt}
                                aria-label={`Mockup ${idx + 1} description`}
                                onChange={(e) => {
                                  const newMockups = [
                                    ...(formData.sections.uiuxDesign.mockups ||
                                      []),
                                  ];
                                  newMockups[idx] = {
                                    ...newMockups[idx],
                                    alt: e.target.value,
                                  };
                                  updateNestedField(
                                    "sections.uiuxDesign.mockups",
                                    newMockups,
                                  );
                                }}
                                placeholder="Mockup description"
                                className="flex-1 px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--text)]"
                              />
                              <button
                                onClick={() => {
                                  const newMockups =
                                    formData.sections.uiuxDesign.mockups?.filter(
                                      (_, i) => i !== idx,
                                    );
                                  updateNestedField(
                                    "sections.uiuxDesign.mockups",
                                    newMockups,
                                  );
                                }}
                                className="text-red-400 hover:text-red-500"
                                aria-label="Delete mockup"
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          ),
                        )}

                        {/* Upload new mockup */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setUploading(true);
                            const formData = new FormData();
                            formData.append("file", file);

                            try {
                              const response = await fetch(
                                "/api/projects/upload-image",
                                {
                                  method: "POST",
                                  body: formData,
                                },
                              );
                              const result = await safeJsonParse(response);

                              if (result.success) {
                                const currentMockups = [
                                  ...(formData.sections.uiuxDesign.mockups ||
                                    []),
                                ];
                                currentMockups.push({
                                  url: result.url,
                                  alt: file.name,
                                });
                                updateNestedField(
                                  "sections.uiuxDesign.mockups",
                                  currentMockups,
                                );
                                showMessage("success", "Mockup uploaded!");
                              }
                            } catch (_error) {
                              showMessage("error", "Upload failed");
                            } finally {
                              setUploading(false);
                            }
                            e.target.value = "";
                          }}
                          className="hidden"
                          id="mockup-upload"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() =>
                            document.getElementById("mockup-upload")?.click()
                          }
                          disabled={uploading}
                        >
                          <MdAdd size={18} />
                          {uploading ? "Uploading..." : "Add Mockup"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Development Section */}
            {activeTab === "development" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      DEVELOPMENT PROCESS
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.developmentProcess.enabled",
                          !formData.sections.developmentProcess.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.developmentProcess.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {formData.sections.developmentProcess.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.developmentProcess.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="development-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="development-heading"
                          value={formData.sections.developmentProcess.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.developmentProcess.heading",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          placeholder="Development Process"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="development-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="development-description"
                          value={
                            formData.sections.developmentProcess.description
                          }
                          onChange={(e) =>
                            updateNestedField(
                              "sections.developmentProcess.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                          placeholder="Describe the development approach..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Tech Stack
                        </label>
                        {formData.sections.developmentProcess.techStack?.map(
                          (tech, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={tech}
                                aria-label={`Technology ${idx + 1}`}
                                onChange={(e) => {
                                  const newStack = [
                                    ...(formData.sections.developmentProcess
                                      .techStack || []),
                                  ];
                                  newStack[idx] = e.target.value;
                                  updateNestedField(
                                    "sections.developmentProcess.techStack",
                                    newStack,
                                  );
                                }}
                                className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                                placeholder="React, Node.js..."
                              />
                              <button
                                onClick={() => {
                                  const newStack =
                                    formData.sections.developmentProcess.techStack?.filter(
                                      (_, i) => i !== idx,
                                    );
                                  updateNestedField(
                                    "sections.developmentProcess.techStack",
                                    newStack,
                                  );
                                }}
                                className="text-red-400"
                                aria-label="Delete technology"
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          ),
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentStack =
                              formData.sections.developmentProcess.techStack ||
                              [];
                            updateNestedField(
                              "sections.developmentProcess.techStack",
                              [...currentStack, ""],
                            );
                          }}
                        >
                          <MdAdd size={18} />
                          Add Technology
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Website Preview Section */}
            {activeTab === "preview" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      WEBSITE PREVIEW
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.websitePreview.enabled",
                          !formData.sections.websitePreview.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.websitePreview.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {formData.sections.websitePreview.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.websitePreview.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="preview-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="preview-heading"
                          value={formData.sections.websitePreview.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.websitePreview.heading",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          placeholder="Final Product"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="preview-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="preview-description"
                          value={formData.sections.websitePreview.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.websitePreview.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                          placeholder="Showcase the final result..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="preview-live-url"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Live URL
                          </label>
                          <input
                            type="url"
                            id="preview-live-url"
                            value={
                              formData.sections.websitePreview.liveUrl || ""
                            }
                            onChange={(e) =>
                              updateNestedField(
                                "sections.websitePreview.liveUrl",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="preview-github-url"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            GitHub URL
                          </label>
                          <input
                            type="url"
                            id="preview-github-url"
                            value={
                              formData.sections.websitePreview.githubUrl || ""
                            }
                            onChange={(e) =>
                              updateNestedField(
                                "sections.websitePreview.githubUrl",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                            placeholder="https://github.com/..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Screenshots
                        </label>
                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                          Add website screenshots
                        </p>

                        {formData.sections.websitePreview.screenshots?.map(
                          (screenshot, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 mb-2 p-2 border border-[var(--border)] rounded-lg"
                            >
                              <img
                                src={screenshot.url}
                                alt={screenshot.alt}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <input
                                type="text"
                                value={screenshot.alt}
                                aria-label={`Screenshot ${idx + 1} description`}
                                onChange={(e) => {
                                  const newScreenshots = [
                                    ...(formData.sections.websitePreview
                                      .screenshots || []),
                                  ];
                                  newScreenshots[idx] = {
                                    ...newScreenshots[idx],
                                    alt: e.target.value,
                                  };
                                  updateNestedField(
                                    "sections.websitePreview.screenshots",
                                    newScreenshots,
                                  );
                                }}
                                placeholder="Screenshot description"
                                className="flex-1 px-3 py-1 bg-[var(--background)] border border-[var(--border)] rounded text-[var(--text)]"
                              />
                              <button
                                onClick={() => {
                                  const newScreenshots =
                                    formData.sections.websitePreview.screenshots?.filter(
                                      (_, i) => i !== idx,
                                    );
                                  updateNestedField(
                                    "sections.websitePreview.screenshots",
                                    newScreenshots,
                                  );
                                }}
                                className="text-red-400 hover:text-red-500"
                                aria-label="Delete screenshot"
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          ),
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setUploading(true);
                            const fd = new FormData();
                            fd.append("file", file);

                            try {
                              const response = await fetch(
                                "/api/projects/upload-image",
                                {
                                  method: "POST",
                                  body: fd,
                                },
                              );
                              const result = await safeJsonParse(response);

                              if (result.success) {
                                const currentScreenshots = [
                                  ...(formData.sections.websitePreview
                                    .screenshots || []),
                                ];
                                currentScreenshots.push({
                                  url: result.url,
                                  alt: file.name,
                                });
                                updateNestedField(
                                  "sections.websitePreview.screenshots",
                                  currentScreenshots,
                                );
                                showMessage("success", "Screenshot uploaded!");
                              }
                            } catch (_error) {
                              showMessage("error", "Upload failed");
                            } finally {
                              setUploading(false);
                            }
                            e.target.value = "";
                          }}
                          className="hidden"
                          id="screenshot-upload"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() =>
                            document
                              .getElementById("screenshot-upload")
                              ?.click()
                          }
                          disabled={uploading}
                        >
                          <MdAdd size={18} />
                          {uploading ? "Uploading..." : "Add Screenshot"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Results & Impact Section */}
            {activeTab === "results" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      RESULTS & IMPACT
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.resultsImpact.enabled",
                          !formData.sections.resultsImpact.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.resultsImpact.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {formData.sections.resultsImpact.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.resultsImpact.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="results-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="results-heading"
                          value={formData.sections.resultsImpact.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.resultsImpact.heading",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          placeholder="Impact & Results"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="results-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="results-description"
                          value={formData.sections.resultsImpact.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.resultsImpact.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                          placeholder="Describe the impact..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Metrics
                        </label>
                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                          Add key metrics (e.g., "50% increase in conversions")
                        </p>

                        {formData.sections.resultsImpact.metrics?.map(
                          (metric, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 mb-2"
                            >
                              <input
                                type="text"
                                value={metric.value}
                                aria-label={`Metric ${idx + 1} value`}
                                onChange={(e) => {
                                  const newMetrics = [
                                    ...(formData.sections.resultsImpact
                                      .metrics || []),
                                  ];
                                  newMetrics[idx] = {
                                    ...newMetrics[idx],
                                    value: e.target.value,
                                  };
                                  updateNestedField(
                                    "sections.resultsImpact.metrics",
                                    newMetrics,
                                  );
                                }}
                                placeholder="50%"
                                className="w-24 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                              />
                              <input
                                type="text"
                                value={metric.label}
                                aria-label={`Metric ${idx + 1} label`}
                                onChange={(e) => {
                                  const newMetrics = [
                                    ...(formData.sections.resultsImpact
                                      .metrics || []),
                                  ];
                                  newMetrics[idx] = {
                                    ...newMetrics[idx],
                                    label: e.target.value,
                                  };
                                  updateNestedField(
                                    "sections.resultsImpact.metrics",
                                    newMetrics,
                                  );
                                }}
                                placeholder="increase in conversions"
                                className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                              />
                              <button
                                onClick={() => {
                                  const newMetrics =
                                    formData.sections.resultsImpact.metrics?.filter(
                                      (_, i) => i !== idx,
                                    );
                                  updateNestedField(
                                    "sections.resultsImpact.metrics",
                                    newMetrics,
                                  );
                                }}
                                className="text-red-400 hover:text-red-500"
                                aria-label="Delete metric"
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          ),
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentMetrics =
                              formData.sections.resultsImpact.metrics || [];
                            updateNestedField(
                              "sections.resultsImpact.metrics",
                              [...currentMetrics, { value: "", label: "" }],
                            );
                          }}
                        >
                          <MdAdd size={18} />
                          Add Metric
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Conclusion Section */}
            {activeTab === "conclusion" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      CONCLUSION
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.conclusion.enabled",
                          !formData.sections.conclusion.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.conclusion.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {formData.sections.conclusion.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.conclusion.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="conclusion-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="conclusion-heading"
                          value={formData.sections.conclusion.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.conclusion.heading",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          placeholder="Conclusion"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="conclusion-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="conclusion-description"
                          value={formData.sections.conclusion.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.conclusion.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-32"
                          placeholder="Wrap up the case study..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text)] mb-2">
                          Lessons Learned
                        </label>
                        {formData.sections.conclusion.lessonsLearned?.map(
                          (lesson, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={lesson}
                                aria-label={`Lesson learned ${idx + 1}`}
                                onChange={(e) => {
                                  const newLessons = [
                                    ...(formData.sections.conclusion
                                      .lessonsLearned || []),
                                  ];
                                  newLessons[idx] = e.target.value;
                                  updateNestedField(
                                    "sections.conclusion.lessonsLearned",
                                    newLessons,
                                  );
                                }}
                                className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                              />
                              <button
                                onClick={() => {
                                  const newLessons =
                                    formData.sections.conclusion.lessonsLearned?.filter(
                                      (_, i) => i !== idx,
                                    );
                                  updateNestedField(
                                    "sections.conclusion.lessonsLearned",
                                    newLessons,
                                  );
                                }}
                                className="text-red-400"
                                aria-label="Delete lesson"
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          ),
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentLessons =
                              formData.sections.conclusion.lessonsLearned || [];
                            updateNestedField(
                              "sections.conclusion.lessonsLearned",
                              [...currentLessons, ""],
                            );
                          }}
                        >
                          <MdAdd size={18} />
                          Add Lesson
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Call to Action Section */}
            {activeTab === "cta" && (
              <div className="space-y-6">
                <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[var(--text)]">
                      CALL TO ACTION
                    </h2>
                    <button
                      onClick={() =>
                        updateNestedField(
                          "sections.callToAction.enabled",
                          !formData.sections.callToAction.enabled,
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${formData.sections.callToAction.enabled ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {formData.sections.callToAction.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>

                  {formData.sections.callToAction.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="cta-heading"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Heading
                        </label>
                        <input
                          type="text"
                          id="cta-heading"
                          value={formData.sections.callToAction.heading}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.callToAction.heading",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                          placeholder="Let's Work Together"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cta-description"
                          className="block text-sm font-medium text-[var(--text)] mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="cta-description"
                          value={formData.sections.callToAction.description}
                          onChange={(e) =>
                            updateNestedField(
                              "sections.callToAction.description",
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)] h-24"
                          placeholder="Encourage visitors to take action..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="cta-primary-button-text"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Primary Button Text
                          </label>
                          <input
                            type="text"
                            id="cta-primary-button-text"
                            value={
                              formData.sections.callToAction.primaryButtonText
                            }
                            onChange={(e) =>
                              updateNestedField(
                                "sections.callToAction.primaryButtonText",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                            placeholder="Contact Me"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cta-primary-button-link"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Primary Button Link
                          </label>
                          <input
                            type="text"
                            id="cta-primary-button-link"
                            value={
                              formData.sections.callToAction.primaryButtonLink
                            }
                            onChange={(e) =>
                              updateNestedField(
                                "sections.callToAction.primaryButtonLink",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                            placeholder="/contact"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="cta-secondary-button-text"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Secondary Button Text (Optional)
                          </label>
                          <input
                            type="text"
                            id="cta-secondary-button-text"
                            value={
                              formData.sections.callToAction
                                .secondaryButtonText || ""
                            }
                            onChange={(e) =>
                              updateNestedField(
                                "sections.callToAction.secondaryButtonText",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                            placeholder="View More Projects"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cta-secondary-button-link"
                            className="block text-sm font-medium text-[var(--text)] mb-2"
                          >
                            Secondary Button Link (Optional)
                          </label>
                          <input
                            type="text"
                            id="cta-secondary-button-link"
                            value={
                              formData.sections.callToAction
                                .secondaryButtonLink || ""
                            }
                            onChange={(e) =>
                              updateNestedField(
                                "sections.callToAction.secondaryButtonLink",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--text)]"
                            placeholder="/projects"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
