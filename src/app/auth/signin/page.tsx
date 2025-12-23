"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--card)]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--accent)]/30 border-t-[var(--accent)]"></div>
        <p className="mt-4 text-[var(--text)]">Redirecting to sign in...</p>
      </div>
    </div>
  );
}
