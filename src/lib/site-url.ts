const FALLBACK_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value?: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  const withProtocol =
    /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).toString();
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  return (
    normalizeSiteUrl(process.env.NEXTAUTH_URL) ||
    normalizeSiteUrl(process.env.COOLIFY_URL) ||
    FALLBACK_SITE_URL
  );
}
