"use client";
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
import {
  MdCheckCircle,
  MdCode,
  MdDesignServices,
  MdDragIndicator,
  MdDraw,
  MdHome,
  MdInfo,
  MdLightbulb,
  MdPalette,
  MdPhone,
  MdPreview,
  MdTrendingUp,
  MdWarning,
} from "react-icons/md";

interface SectionOrderManagerProps {
  sectionOrder: string[];
  sections: Record<string, { enabled: boolean }>;
  onChange: (newOrder: string[]) => void;
}

const sectionConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  hero: {
    label: "Hero Section",
    icon: <MdHome className="w-5 h-5" />,
    color: "from-blue-500 to-blue-600",
  },
  overview: {
    label: "Project Overview",
    icon: <MdInfo className="w-5 h-5" />,
    color: "from-purple-500 to-purple-600",
  },
  problemStatement: {
    label: "Problem Statement",
    icon: <MdWarning className="w-5 h-5" />,
    color: "from-orange-500 to-orange-600",
  },
  solutions: {
    label: "Solutions",
    icon: <MdLightbulb className="w-5 h-5" />,
    color: "from-green-500 to-green-600",
  },
  branding: {
    label: "Branding",
    icon: <MdPalette className="w-5 h-5" />,
    color: "from-pink-500 to-pink-600",
  },
  wireframes: {
    label: "Wireframes",
    icon: <MdDraw className="w-5 h-5" />,
    color: "from-gray-500 to-gray-600",
  },
  uiuxDesign: {
    label: "UI/UX Design",
    icon: <MdDesignServices className="w-5 h-5" />,
    color: "from-indigo-500 to-indigo-600",
  },
  developmentProcess: {
    label: "Development Process",
    icon: <MdCode className="w-5 h-5" />,
    color: "from-cyan-500 to-cyan-600",
  },
  websitePreview: {
    label: "Website Preview",
    icon: <MdPreview className="w-5 h-5" />,
    color: "from-teal-500 to-teal-600",
  },
  resultsImpact: {
    label: "Results & Impact",
    icon: <MdTrendingUp className="w-5 h-5" />,
    color: "from-yellow-500 to-yellow-600",
  },
  conclusion: {
    label: "Conclusion",
    icon: <MdCheckCircle className="w-5 h-5" />,
    color: "from-emerald-500 to-emerald-600",
  },
  callToAction: {
    label: "Call to Action",
    icon: <MdPhone className="w-5 h-5" />,
    color: "from-red-500 to-red-600",
  },
};

interface SortableItemProps {
  id: string;
  section: string;
  enabled: boolean;
  index: number;
}

function SortableItem({ id, section, enabled, index }: SortableItemProps) {
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

  const config = sectionConfig[section];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? "z-50" : ""}`}
    >
      <div
        className={`
          flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200
          ${
            isDragging
              ? "border-[var(--accent)] shadow-2xl shadow-[var(--accent)]/30 bg-[var(--surface)] scale-105"
              : "border-[var(--border)] bg-[var(--surface)]/50 hover:border-[var(--accent)]/50 hover:shadow-lg"
          }
          ${!enabled ? "opacity-60" : ""}
        `}
      >
        {/* Order Number */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--background)] border border-[var(--border)] font-bold text-sm text-[var(--text)]">
          {index + 1}
        </div>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`
            cursor-grab active:cursor-grabbing p-2 rounded-lg
            transition-colors duration-200
            ${
              isDragging
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
            }
          `}
        >
          <MdDragIndicator className="w-6 h-6" />
        </div>

        {/* Section Icon */}
        <div
          className={`
            p-2.5 rounded-lg bg-gradient-to-br ${config.color} text-white
            shadow-md
          `}
        >
          {config.icon}
        </div>

        {/* Section Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--text)]">{config.label}</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {enabled ? "Enabled" : "Disabled"}
          </p>
        </div>

        {/* Status Indicator */}
        <div
          className={`
            w-3 h-3 rounded-full transition-all
            ${
              enabled
                ? "bg-green-500 shadow-lg shadow-green-500/50 animate-pulse"
                : "bg-gray-400"
            }
          `}
        />
      </div>
    </div>
  );
}

export default function SectionOrderManager({
  sectionOrder,
  sections,
  onChange,
}: SectionOrderManagerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);

      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      onChange(newOrder);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--accent)]/10 to-transparent p-6 rounded-xl border border-[var(--border)]">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
          Section Order
        </h2>
        <p className="text-[var(--text-secondary)]">
          Drag and drop sections to reorder them. The order here determines how
          sections appear on the public project page.
        </p>
      </div>

      {/* Drag and Drop List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sectionOrder.map((sectionKey, index) => (
              <SortableItem
                key={sectionKey}
                id={sectionKey}
                section={sectionKey}
                enabled={sections[sectionKey]?.enabled ?? false}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Info Box */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex gap-3">
          <MdInfo className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[var(--text)] mb-1">
              How it works
            </h4>
            <ul className="text-sm text-[var(--text-secondary)] space-y-1">
              <li>• Grab any section by the drag handle (≡) icon</li>
              <li>• Drag it up or down to reorder</li>
              <li>• Disabled sections are still shown but appear dimmed</li>
              <li>• Save your changes using the Save button at the top</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
