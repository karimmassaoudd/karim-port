"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdFolder,
  MdHome,
  MdInfo,
  MdPerson,
  MdSave,
  MdWork,
} from "react-icons/md";
import ProjectSelector from "@/components/admin/ProjectSelector";

// Lazy load Toast component
const Toast = dynamic(() => import("@/components/Toast"), { ssr: false });


interface ExperienceItem {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
}

interface ProjectReference {
  projectId: string;
  order: number;
  isVisible: boolean;
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  isVisible: boolean;
}

interface HomePageData {
  hero: {
    mainTitle: string;
    subtitle: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  bio: {
    bioText: string;
    maxWords: number;
  };
  about: {
    sectionLabel: string;
    heading: string;
    mainText: string;
    phoneNumber: string;
    email: string;
    linkedinUrl: string;
    profileCardName: string;
    profileCardTitle: string;
    profileCardHandle: string;
    profileCardAvatarUrl: string;
  };
  userExperience: {
    sectionLabel: string;
    heading: string;
    items: ExperienceItem[];
  };
  featuredProjects: ProjectReference[];
  footer: {
    ownerName: string;
    ownerTitle: string;
    ownerInitial: string;
    ownerAvatarUrl: string;
    email: string;
    phone: string;
    location: string;
    copyrightText: string;
    socialLinks: SocialLink[];
  };
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<
    "hero" | "bio" | "about" | "experience" | "projects"
  >("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [_selectedProjectIndex, _setSelectedProjectIndex] = useState<
    number | null
  >(null);
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState<
    number | null
  >(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<HomePageData>({
    hero: {
      mainTitle: "",
      subtitle: "",
      primaryButtonText: "",
      primaryButtonLink: "",
      secondaryButtonText: "",
      secondaryButtonLink: "",
    },
    bio: {
      bioText: "",
      maxWords: 35,
    },
    about: {
      sectionLabel: "",
      heading: "",
      mainText: "",
      phoneNumber: "",
      email: "",
      linkedinUrl: "",
      profileCardName: "",
      profileCardTitle: "",
      profileCardHandle: "",
      profileCardAvatarUrl: "",
    },
    userExperience: {
      sectionLabel: "",
      heading: "",
      items: [],
    },
    featuredProjects: [],
    footer: {
      ownerName: "",
      ownerTitle: "",
      ownerInitial: "",
      ownerAvatarUrl: "",
      email: "",
      phone: "",
      location: "",
      copyrightText: "",
      socialLinks: [],
    },
  });

  const fetchData = async () => {
    try {
      const response = await fetch("/api/homepage");
      const result = await response.json();

      if (result.success) {
        setFormData({
          ...result.data,
          featuredProjects: result.data.featuredProjects || [],
          footer: result.data.footer || {
            ownerName: "",
            ownerTitle: "",
            ownerInitial: "",
            ownerAvatarUrl: "",
            email: "",
            phone: "",
            location: "",
            copyrightText: "",
            socialLinks: [],
          },
        });
      } else {
        setMessage({ type: "error", text: "Failed to load data" });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: "success", text: "Changes saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save changes" });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setMessage({ type: "error", text: "Failed to save changes" });
    } finally {
      setSaving(false);
    }
  };

  const updateExperienceItem = useCallback(
    (index: number, field: keyof ExperienceItem, value: string | number) => {
      setFormData((prev) => {
        const newItems = [...prev.userExperience.items];
        newItems[index] = { ...newItems[index], [field]: value };
        return {
          ...prev,
          userExperience: { ...prev.userExperience, items: newItems },
        };
      });
    },
    [],
  );

  const addExperienceItem = useCallback(() => {
    setFormData((prev) => {
      const newId = prev.userExperience.items.length + 1;
      return {
        ...prev,
        userExperience: {
          ...prev.userExperience,
          items: [
            ...prev.userExperience.items,
            {
              id: newId,
              title: "",
              description: "",
              fullDescription: "",
            },
          ],
        },
      };
    });
    setSelectedExperienceIndex((prev) => (prev === null ? 0 : prev + 1));
  }, []);

  const removeExperienceItem = useCallback((index: number) => {
    let itemsLength = 0;
    setFormData((prev) => {
      const newItems = prev.userExperience.items.filter((_, i) => i !== index);
      itemsLength = newItems.length;
      return {
        ...prev,
        userExperience: { ...prev.userExperience, items: newItems },
      };
    });
    setSelectedExperienceIndex((prev) => {
      if (prev === index) return itemsLength > 0 ? 0 : null;
      if (prev !== null && prev > index) return prev - 1;
      return prev;
    });
  }, []);

  // Optimized field update handlers to prevent recreation
  const _updateHeroField = useCallback(
    (field: keyof HomePageData["hero"], value: string) => {
      setFormData((prev) => ({
        ...prev,
        hero: { ...prev.hero, [field]: value },
      }));
    },
    [],
  );

  const _updateBioField = useCallback(
    (field: keyof HomePageData["bio"], value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        bio: { ...prev.bio, [field]: value },
      }));
    },
    [],
  );

  const _updateAboutField = useCallback(
    (field: keyof HomePageData["about"], value: string) => {
      setFormData((prev) => ({
        ...prev,
        about: { ...prev.about, [field]: value },
      }));
    },
    [],
  );

  const _updateExperienceSection = useCallback(
    (field: "sectionLabel" | "heading", value: string) => {
      setFormData((prev) => ({
        ...prev,
        userExperience: { ...prev.userExperience, [field]: value },
      }));
    },
    [],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--accent)] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header and Tabs Container */}
      <div className="mb-6 backdrop-blur-xl bg-white/60 dark:bg-[var(--card)]/60 rounded-xl shadow-lg border border-white/30 dark:border-white/20 p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-base font-secondary font-bold text-headline mb-2">
            Homepage Dashboard
          </h3>
          <p className="text-xs font-secondary text-gray-600 dark:text-gray-300">
            Edit and manage your homepage content
          </p>
        </div>

        {/* Section Tabs */}
        <div ref={tabsRef}>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSection("hero")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-secondary font-semibold transition-all whitespace-nowrap ${
                activeSection === "hero"
                  ? "bg-[var(--accent)]/20 backdrop-blur-md text-[var(--accent)] border border-[var(--accent)]/30 shadow-md"
                  : "text-[var(--text)] hover:bg-white/50 dark:hover:bg-white/20 backdrop-blur-md border border-transparent hover:border-white/30"
              }`}
            >
              <MdHome className="text-xl" />
              <span>Hero Section</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("bio")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-secondary font-semibold transition-all whitespace-nowrap ${
                activeSection === "bio"
                  ? "bg-[var(--accent)]/20 backdrop-blur-md text-[var(--accent)] border border-[var(--accent)]/30 shadow-md"
                  : "text-[var(--text)] hover:bg-white/50 dark:hover:bg-white/20 backdrop-blur-md border border-transparent hover:border-white/30"
              }`}
            >
              <MdPerson className="text-xl" />
              <span>Bio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("about")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-secondary font-semibold transition-all whitespace-nowrap ${
                activeSection === "about"
                  ? "bg-[var(--accent)]/20 backdrop-blur-md text-[var(--accent)] border border-[var(--accent)]/30 shadow-md"
                  : "text-[var(--text)] hover:bg-white/50 dark:hover:bg-white/20 backdrop-blur-md border border-transparent hover:border-white/30"
              }`}
            >
              <MdInfo className="text-xl" />
              <span>About</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("experience")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-secondary font-semibold transition-all whitespace-nowrap ${
                activeSection === "experience"
                  ? "bg-[var(--accent)]/20 backdrop-blur-md text-[var(--accent)] border border-[var(--accent)]/30 shadow-md"
                  : "text-[var(--text)] hover:bg-white/50 dark:hover:bg-white/20 backdrop-blur-md border border-transparent hover:border-white/30"
              }`}
            >
              <MdWork className="text-xl" />
              <span>Experience</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("projects")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-secondary font-semibold transition-all whitespace-nowrap ${
                activeSection === "projects"
                  ? "bg-[var(--accent)]/20 backdrop-blur-md text-[var(--accent)] border border-[var(--accent)]/30 shadow-md"
                  : "text-[var(--text)] hover:bg-white/50 dark:hover:bg-white/20 backdrop-blur-md border border-transparent hover:border-white/30"
              }`}
            >
              <MdFolder className="text-xl" />
              <span>Projects</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          ref={contentRef}
          className="backdrop-blur-xl bg-white/70 dark:bg-[var(--card)]/70 rounded-xl shadow-lg border border-white/40 dark:border-white/30 p-6 mb-6"
        >
          {/* Hero Section */}
          {activeSection === "hero" && (
            <div className="space-y-5">
              <h3 className="text-xs font-secondary font-bold text-headline mb-6">
                Hero Section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={formData.hero.mainTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, mainTitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.hero.subtitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, subtitle: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.hero.primaryButtonText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          primaryButtonText: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.hero.primaryButtonLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          primaryButtonLink: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.hero.secondaryButtonText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          secondaryButtonText: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.hero.secondaryButtonLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: {
                          ...formData.hero,
                          secondaryButtonLink: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bio Section */}
          {activeSection === "bio" && (
            <div className="space-y-5">
              <h3 className="text-xs font-secondary font-bold text-headline mb-6">
                Bio Section
              </h3>
              <div>
                <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                  Bio Text
                </label>
                <textarea
                  value={formData.bio.bioText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bio: { ...formData.bio, bioText: e.target.value },
                    })
                  }
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                />
              </div>
              <div>
                <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                  Max Words
                </label>
                <input
                  type="number"
                  value={formData.bio.maxWords}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bio: {
                        ...formData.bio,
                        maxWords: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                />
              </div>
            </div>
          )}

          {/* About Section */}
          {activeSection === "about" && (
            <div className="space-y-5">
              <h3 className="text-xs font-secondary font-bold text-headline mb-6">
                About Section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Section Label
                  </label>
                  <input
                    type="text"
                    value={formData.about.sectionLabel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          sectionLabel: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={formData.about.heading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, heading: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Main Text
                  </label>
                  <textarea
                    value={formData.about.mainText}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, mainText: e.target.value },
                      })
                    }
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.about.phoneNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          phoneNumber: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.about.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, email: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.about.linkedinUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          linkedinUrl: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Profile Card Name
                  </label>
                  <input
                    type="text"
                    value={formData.about.profileCardName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          profileCardName: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Profile Card Title
                  </label>
                  <input
                    type="text"
                    value={formData.about.profileCardTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          profileCardTitle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Profile Card Handle
                  </label>
                  <input
                    type="text"
                    value={formData.about.profileCardHandle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          profileCardHandle: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Profile Card Avatar
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append("file", file);
                          try {
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: formData,
                            });
                            const data = await res.json();
                            if (data.success) {
                              setFormData((prev) => ({
                                ...prev,
                                about: {
                                  ...prev.about,
                                  profileCardAvatarUrl: data.url,
                                },
                              }));
                            }
                          } catch (error) {
                            console.error("Upload failed:", error);
                          }
                        }
                      }}
                      className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-secondary file:font-semibold file:bg-[var(--accent)]/10 file:text-[var(--accent)] hover:file:bg-[var(--accent)]/20"
                    />
                    {formData.about.profileCardAvatarUrl && (
                      <div className="flex items-center gap-2">
                        <img
                          src={formData.about.profileCardAvatarUrl}
                          alt="Avatar preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-[var(--accent)]/20"
                        />
                        <input
                          type="url"
                          value={formData.about.profileCardAvatarUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              about: {
                                ...formData.about,
                                profileCardAvatarUrl: e.target.value,
                              },
                            })
                          }
                          placeholder="Or enter URL manually"
                          className="flex-1 px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all text-xs placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Experience Section */}
          {activeSection === "experience" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-secondary font-bold text-headline">
                  Experience Section
                </h3>
                <button
                  type="button"
                  onClick={addExperienceItem}
                  className="px-4 py-2 rounded-lg font-secondary font-semibold backdrop-blur-md bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/30 hover:shadow-lg transition-all shadow-md"
                >
                  + Add Experience
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Section Label
                  </label>
                  <input
                    type="text"
                    value={formData.userExperience.sectionLabel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        userExperience: {
                          ...formData.userExperience,
                          sectionLabel: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={formData.userExperience.heading}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        userExperience: {
                          ...formData.userExperience,
                          heading: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                  />
                </div>
              </div>

              {formData.userExperience.items.length === 0 ? (
                <div className="text-center py-12 backdrop-blur-xl bg-white/60 dark:bg-[var(--card)]/60 rounded-xl border border-white/30 dark:border-white/20 shadow-md">
                  <p className="text-xs font-secondary text-gray-600 dark:text-gray-300">
                    No experience items yet. Click "+ Add Experience" to create
                    one.
                  </p>
                </div>
              ) : (
                <div className="flex gap-4">
                  {/* Left Sidebar - Experience List */}
                  <div className="w-64 backdrop-blur-xl bg-white/60 dark:bg-[var(--card)]/60 rounded-xl border border-white/30 dark:border-white/20 shadow-lg p-4">
                    <h4 className="text-xs font-secondary font-bold text-headline mb-3">
                      All Experience
                    </h4>
                    <div className="space-y-2">
                      {formData.userExperience.items.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedExperienceIndex(index)}
                          className={`w-full text-left px-3 py-2 rounded-lg font-secondary text-xs transition-all backdrop-blur-sm ${
                            selectedExperienceIndex === index
                              ? "bg-[var(--accent)]/30 text-[var(--accent)] border border-[var(--accent)]/40 shadow-md"
                              : "backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/20 hover:bg-[var(--accent)]/20 hover:border-[var(--accent)]/30"
                          }`}
                        >
                          <div className="font-semibold truncate">
                            {item.title || `Experience #${index + 1}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Experience Details */}
                  {selectedExperienceIndex !== null &&
                    formData.userExperience.items[selectedExperienceIndex] && (
                      <div className="flex-1 backdrop-blur-xl bg-white/60 dark:bg-[var(--card)]/60 rounded-xl shadow-lg border border-white/30 dark:border-white/20 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-xs font-secondary font-bold text-headline">
                            {formData.userExperience.items[
                              selectedExperienceIndex
                            ].title ||
                              `Experience #${selectedExperienceIndex + 1}`}
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              removeExperienceItem(selectedExperienceIndex)
                            }
                            className="px-3 py-1 rounded-lg font-secondary text-xs font-semibold bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={
                                formData.userExperience.items[
                                  selectedExperienceIndex
                                ].title
                              }
                              onChange={(e) =>
                                updateExperienceItem(
                                  selectedExperienceIndex,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                              Description
                            </label>
                            <textarea
                              value={
                                formData.userExperience.items[
                                  selectedExperienceIndex
                                ].description
                              }
                              onChange={(e) =>
                                updateExperienceItem(
                                  selectedExperienceIndex,
                                  "description",
                                  e.target.value,
                                )
                              }
                              rows={3}
                              className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                              Full Description
                            </label>
                            <textarea
                              value={
                                formData.userExperience.items[
                                  selectedExperienceIndex
                                ].fullDescription
                              }
                              onChange={(e) =>
                                updateExperienceItem(
                                  selectedExperienceIndex,
                                  "fullDescription",
                                  e.target.value,
                                )
                              }
                              rows={4}
                              className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {/* Projects Section */}
          {activeSection === "projects" && (
            <div className="space-y-5">
              <div className="backdrop-blur-xl bg-white/70 dark:bg-[var(--card)]/70 rounded-xl shadow-lg border border-white/40 dark:border-white/30 p-6">
                <ProjectSelector
                  selectedProjects={formData.featuredProjects}
                  onChange={(projects) =>
                    setFormData((prev) => ({
                      ...prev,
                      featuredProjects: projects,
                    }))
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-secondary font-semibold backdrop-blur-md bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/30 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <MdSave className="text-xl" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  );
}
