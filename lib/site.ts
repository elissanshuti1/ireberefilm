export const PRODUCTION_SITE_URL = "https://ireberefilm.vercel.app";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

function isLocalHostname(hostname: string) {
  const value = hostname.toLowerCase();
  return LOCAL_HOSTNAMES.has(value) || value.endsWith(".localhost");
}

function normalizeBaseUrl(value?: string | null) {
  if (!value) return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    if (isLocalHostname(url.hostname)) return "";
    return url.origin;
  } catch {
    return "";
  }
}

function normalizeAbsoluteUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    const origin = isLocalHostname(url.hostname) ? PRODUCTION_SITE_URL : url.origin;
    return `${origin}${url.pathname}${url.search}`;
  } catch {
    return "";
  }
}

export function getSiteUrl() {
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL) || PRODUCTION_SITE_URL;
}

export function absoluteUrl(path: string) {
  const trimmed = path.trim();
  if (!trimmed) return getSiteUrl();
  if (/^https?:\/\//i.test(trimmed)) return normalizeAbsoluteUrl(trimmed) || getSiteUrl();
  const suffix = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return normalizeAbsoluteUrl(`${getSiteUrl()}${suffix}`) || getSiteUrl();
}
