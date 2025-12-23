"use client";

import ContactSection from "./ContactSection";

export default function ContactClient() {
  // Simple client-only wrapper so server components can include a client component
  // without using `next/dynamic({ ssr: false })` (which is not allowed in Server Components).
  return <ContactSection />;
}
