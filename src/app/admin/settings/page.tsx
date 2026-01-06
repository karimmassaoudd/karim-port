"use client";
import { gsap } from "gsap";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdSave,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import Toast from "@/components/Toast";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState<
    "account" | "password" | "email"
  >("account");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Email configuration state
  const [gmailUser, setGmailUser] = useState("");
  const [gmailAppPassword, setGmailAppPassword] = useState("");
  const [_emailConfigured, setEmailConfigured] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const fetchEmailConfig = async () => {
    try {
      const response = await fetch("/api/email-config");
      const data = await response.json();

      if (data.success) {
        setGmailUser(data.data.gmailUser);
        setEmailConfigured(data.data.configured);
        // Show success toast if email is configured
        if (data.data.configured) {
          setEmailMessage({
            type: "success",
            text: "✓ Email service is configured and active",
          });
        }
        // Don't set the password since it's masked
      }
    } catch (error) {
      console.error("Error fetching email config:", error);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.from(".settings-card", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.5,
        delay: 0.2,
        ease: "power3.out",
      });
    });

    // Fetch email configuration
    fetchEmailConfig();

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0] as any,
        duration: 0.4,
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0] as any,
        duration: 0.4,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        gsap.to(".success-icon", {
          scale: [0, 1.2, 1] as any,
          duration: 0.5,
        });
      } else {
        setMessage({ type: "error", text: data.error });
        gsap.to(formRef.current, {
          x: [-10, 10, -10, 10, 0] as any,
          duration: 0.4,
        });
      }
    } catch (_error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage(null);

    if (!gmailUser || !gmailAppPassword) {
      setEmailMessage({
        type: "error",
        text: "Both Gmail user and app password are required",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmailUser)) {
      setEmailMessage({ type: "error", text: "Invalid email format" });
      return;
    }

    setEmailLoading(true);

    try {
      const response = await fetch("/api/email-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmailUser, gmailAppPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setEmailMessage({
          type: "success",
          text: "Email configuration saved successfully!",
        });
        setEmailConfigured(true);
        setGmailAppPassword(""); // Clear password field after saving
      } else {
        setEmailMessage({ type: "error", text: data.error });
      }
    } catch (_error) {
      setEmailMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <>
      <div ref={containerRef} className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-base font-secondary font-bold text-headline mb-2">
            Settings
          </h3>
          <p className="text-xs font-secondary text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Section Tabs */}
        <div
          ref={tabsRef}
          className="mb-6 backdrop-blur-xl bg-white/80 dark:bg-[var(--card)]/80 rounded-lg shadow-md border border-gray-300 dark:border-white/20 p-2"
        >
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSection("account")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-secondary font-semibold transition-all whitespace-nowrap ${
                activeSection === "account"
                  ? "bg-[var(--accent)]/10 backdrop-blur-md text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm"
                  : "text-gray-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              <MdPerson className="text-xl" />
              <span>Account Information</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("password")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-secondary font-semibold transition-all whitespace-nowrap ${
                activeSection === "password"
                  ? "bg-[var(--accent)]/10 backdrop-blur-md text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm"
                  : "text-gray-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              <MdLock className="text-xl" />
              <span>Change Password</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("email")}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-secondary font-semibold transition-all whitespace-nowrap ${
                activeSection === "email"
                  ? "bg-[var(--accent)]/10 backdrop-blur-md text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm"
                  : "text-gray-900 dark:text-white hover:bg-white/40 dark:hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              <MdEmail className="text-xl" />
              <span>Email Configuration</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-[var(--card)]/80 rounded-lg shadow-sm border border-gray-300 dark:border-white/20 p-6">
          {/* Account Information */}
          {activeSection === "account" && (
            <div className="settings-card">
              <h3 className="text-xs font-secondary font-bold text-headline mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={session?.user?.name || ""}
                    disabled
                    className="w-full px-4 py-2 rounded-lg font-secondary bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 rounded-lg font-secondary bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Change Password */}
          {activeSection === "password" && (
            <div className="settings-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-lg flex items-center justify-center shadow-lg">
                  <MdLock className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xs font-secondary font-bold text-headline">
                    Change Password
                  </h3>
                  <p className="text-[10px] font-secondary text-gray-600 dark:text-gray-300">
                    Update your password to keep your account secure
                  </p>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all"
                      placeholder="Enter new password (min 6 characters)"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords ? (
                        <MdVisibilityOff className="text-xl" />
                      ) : (
                        <MdVisibility className="text-xl" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg font-secondary font-semibold backdrop-blur-md bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <MdSave className="text-lg" />
                  <span>
                    {loading ? "Changing Password..." : "Change Password"}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* Email Configuration */}
          {activeSection === "email" && (
            <div className="settings-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-lg flex items-center justify-center shadow-lg">
                  <svg
                    className="text-white text-xl"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-secondary font-bold text-headline">
                    Email Configuration
                  </h3>
                  <p className="text-[10px] font-secondary text-gray-600 dark:text-gray-300">
                    Configure Gmail for password reset emails
                  </p>
                </div>
              </div>

              <form onSubmit={handleEmailConfigSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Gmail Address
                  </label>
                  <input
                    type="email"
                    value={gmailUser}
                    onChange={(e) => setGmailUser(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all"
                    placeholder="your-email@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-secondary font-semibold text-headline mb-2">
                    Gmail App Password
                  </label>
                  <input
                    type="password"
                    value={gmailAppPassword}
                    onChange={(e) => setGmailAppPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg font-secondary backdrop-blur-sm bg-white/70 dark:bg-gray-800/50 text-gray-900 dark:text-white border border-gray-300 dark:border-white/20 focus:border-[var(--accent)] dark:focus:border-[var(--accent)] focus:outline-none transition-all"
                    placeholder="Enter 16-character app password"
                    required
                  />
                  <p className="mt-2 text-xs font-secondary text-gray-600 dark:text-gray-300">
                    Get an App Password from{" "}
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:opacity-80 underline"
                    >
                      Google Account Settings
                    </a>
                  </p>
                </div>

                <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-lg p-4">
                  <h4 className="text-xs font-secondary font-semibold text-[var(--accent)] mb-2">
                    How to get Gmail App Password:
                  </h4>
                  <ol className="text-xs font-secondary text-gray-900 dark:text-white space-y-1 list-decimal list-inside">
                    <li>Go to your Google Account settings</li>
                    <li>
                      Navigate to Security → 2-Step Verification (enable if not
                      enabled)
                    </li>
                    <li>Scroll down to "App passwords"</li>
                    <li>Select "Mail" and your device</li>
                    <li>Copy the generated 16-character password</li>
                    <li>Paste it here</li>
                  </ol>
                </div>

                <button
                  type="submit"
                  disabled={emailLoading}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg font-secondary font-semibold backdrop-blur-md bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <MdSave className="text-lg" />
                  <span>
                    {emailLoading ? "Saving..." : "Save Email Configuration"}
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}
      {emailMessage && (
        <Toast
          message={emailMessage.text}
          type={emailMessage.type}
          onClose={() => setEmailMessage(null)}
        />
      )}
    </>
  );
}
