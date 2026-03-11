import type { Session } from "next-auth";

export function getSessionRole(session: Session | null): string | undefined {
  const user = session?.user as unknown;
  if (!user || typeof user !== "object") return undefined;

  const role = (user as { role?: unknown }).role;
  return typeof role === "string" ? role : undefined;
}

export function isAdminSession(session: Session | null): boolean {
  return getSessionRole(session) === "admin";
}
