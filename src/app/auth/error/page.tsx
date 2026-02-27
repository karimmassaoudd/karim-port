"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  useEffect(() => {
    // Auto redirect to signin after 3 seconds
    const timer = setTimeout(() => {
      router.push("/auth/signin");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Invalid email or password. Please try again.";
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="max-w-md w-full mx-4">
        <div className="bg-[var(--card)] rounded-lg shadow-xl p-8 border border-red-500/20">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] mb-2">
              Authentication Error
            </h1>
            <p className="text-[var(--text-secondary)] mb-6">
              {getErrorMessage(error)}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/auth/signin")}
                className="w-full px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-all"
              >
                Back to Sign In
              </button>
              <p className="text-sm text-[var(--text-secondary)]">
                Redirecting in 3 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-solid border-[var(--accent)] border-r-transparent"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
