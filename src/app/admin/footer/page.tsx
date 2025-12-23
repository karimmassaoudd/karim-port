"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { MdSave } from "react-icons/md";

// Lazy load Toast component
const Toast = dynamic(() => import("@/components/Toast"), { ssr: false });

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  isVisible: boolean;
}

interface FooterData {
  ownerName: string;
  ownerTitle: string;
  ownerInitial: string;
  ownerAvatarUrl: string;
  email: string;
  phone: string;
  location: string;
  copyrightText: string;
  socialLinks: SocialLink[];
}

export default function FooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FooterData>({
    ownerName: "",
    ownerTitle: "",
    ownerInitial: "",
    ownerAvatarUrl: "",
    email: "",
    phone: "",
    location: "",
    copyrightText: "",
    socialLinks: [],
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchData = async () => {
    console.log("Footer: Starting fetchData...");
    try {
      const response = await fetch("/api/homepage");
      console.log("Footer: Response status:", response.status);
      const result = await response.json();
      console.log("Footer: Result:", result);

      if (result.success && result.data.footer) {
        setFormData(result.data.footer);
        console.log("Footer: Data loaded successfully");
      } else {
        console.error("Footer: No footer data in response");
        setMessage({ type: "error", text: "Failed to load footer data" });
      }
    } catch (error) {
      console.error("Footer: Failed to fetch footer data:", error);
      setMessage({ type: "error", text: "Failed to load footer data" });
    } finally {
      console.log("Footer: Setting loading to false");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ footer: formData }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Footer saved successfully!" });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to save footer",
        });
      }
    } catch (error) {
      console.error("Failed to save footer:", error);
      setMessage({ type: "error", text: "Failed to save footer" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--accent)] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Loading footer data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-base font-secondary font-bold text-headline mb-2">
          Footer
        </h3>
        <p className="text-xs font-secondary text-gray-600 dark:text-gray-300">
          Customize the footer section that appears in the sidebar menu
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          ref={contentRef}
          className="backdrop-blur-xl bg-white/70 dark:bg-[var(--card)]/70 rounded-xl shadow-lg border border-white/40 dark:border-white/30 p-6 mb-6"
        >
          {/* Owner Info */}
          <h3 className="text-xs font-secondary font-bold text-headline mb-6">
            Owner Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                Owner Name
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData({ ...formData, ownerName: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
              />
            </div>
            <div>
              <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                Owner Title
              </label>
              <input
                type="text"
                value={formData.ownerTitle}
                onChange={(e) =>
                  setFormData({ ...formData, ownerTitle: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
              />
            </div>
            <div>
              <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                Owner Initial (for avatar)
              </label>
              <input
                type="text"
                value={formData.ownerInitial}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setFormData({ ...formData, ownerInitial: value.slice(0, 1) });
                }}
                maxLength={1}
                placeholder="K"
                className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
              />
            </div>
            <div>
              <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                Avatar URL (optional)
              </label>
              <input
                type="text"
                value={formData.ownerAvatarUrl}
                onChange={(e) =>
                  setFormData({ ...formData, ownerAvatarUrl: e.target.value })
                }
                placeholder="Leave empty to use initial"
                className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
              />
            </div>
          </div>

          {/* Contact Info */}
          <h4 className="text-xs font-secondary font-bold text-headline mt-8 mb-4">
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
              />
            </div>
            <div>
              <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                Location (optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="City, Country"
                className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all focus:shadow-md"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-secondary font-bold text-headline">
                Social Links
              </h4>
              <button
                type="button"
                onClick={() => {
                  const newLink: SocialLink = {
                    id: Date.now(),
                    platform: "",
                    url: "",
                    icon: "link",
                    isVisible: true,
                  };
                  setFormData({
                    ...formData,
                    socialLinks: [...formData.socialLinks, newLink],
                  });
                }}
                className="px-4 py-2 rounded-lg font-secondary font-semibold backdrop-blur-md bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/30 hover:shadow-lg transition-all shadow-md text-xs"
              >
                + Add Social Link
              </button>
            </div>

            <div className="space-y-3">
              {formData.socialLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="flex items-center gap-3 p-3 backdrop-blur-sm bg-white/50 dark:bg-gray-800/30 rounded-lg border border-white/30 dark:border-white/20"
                >
                  <select
                    value={link.icon}
                    onChange={(e) => {
                      const updated = [...formData.socialLinks];
                      updated[index].icon = e.target.value;
                      setFormData({ ...formData, socialLinks: updated });
                    }}
                    className="px-3 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] focus:outline-none text-xs"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="dribbble">Dribbble</option>
                    <option value="behance">Behance</option>
                    <option value="link">Other Link</option>
                  </select>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => {
                      const updated = [...formData.socialLinks];
                      updated[index].platform = e.target.value;
                      setFormData({ ...formData, socialLinks: updated });
                    }}
                    placeholder="Platform Name"
                    className="flex-1 px-3 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] focus:outline-none text-xs"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...formData.socialLinks];
                      updated[index].url = e.target.value;
                      setFormData({ ...formData, socialLinks: updated });
                    }}
                    placeholder="https://..."
                    className="flex-[2] px-3 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-white/30 dark:border-white/20 focus:border-[var(--accent)] focus:outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...formData.socialLinks];
                      updated[index].isVisible = !updated[index].isVisible;
                      setFormData({ ...formData, socialLinks: updated });
                    }}
                    className={`px-3 py-2 rounded-lg font-secondary text-xs ${
                      link.isVisible
                        ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30"
                        : "bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30"
                    }`}
                  >
                    {link.isVisible ? "Visible" : "Hidden"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.socialLinks.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, socialLinks: updated });
                    }}
                    className="px-3 py-2 rounded-lg font-secondary text-xs bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/30"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {formData.socialLinks.length === 0 && (
                <p className="text-xs font-secondary text-gray-600 dark:text-gray-300 text-center py-4">
                  No social links yet. Click "+ Add Social Link" to add one.
                </p>
              )}
            </div>
          </div>
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
