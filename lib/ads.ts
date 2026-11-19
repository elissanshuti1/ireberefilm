import type { AdPlacement, AdPopupFrequency, AdRecord } from "@/lib/types";

export const adPlacements: { value: AdPlacement; label: string }[] = [
  { value: "home_after_hero", label: "Home - nyuma ya hero" },
  { value: "home_between", label: "Home - hagati ya filime" },
  { value: "browse_top", label: "Browse - hejuru" },
  { value: "movie_banner", label: "Movie - mbere y'ubutumwa" },
  { value: "movie_popup", label: "Popup kuri movie" },
  { value: "footer", label: "Footer" },
];

export const adPopupFrequencies: { value: AdPopupFrequency; label: string }[] = [
  { value: "every_page", label: "Buri gace kamwe (buri movie)" },
  { value: "per_movie", label: "Kenshi kuri buri filime muri visit imwe" },
  { value: "per_visit", label: "Kenshi muri visit imwe" },
];

export const defaultAdDurationSeconds = 10;

export function isAdPlacement(value: string): value is AdPlacement {
  return adPlacements.some((item) => item.value === value);
}

export function isAdPopupFrequency(value: string): value is AdPopupFrequency {
  return adPopupFrequencies.some((item) => item.value === value);
}

export function isAdActive(ad: AdRecord, now = new Date()) {
  if (!ad.active) return false;
  if (ad.startAt && now < new Date(ad.startAt)) return false;
  if (ad.endAt && now > new Date(ad.endAt)) return false;
  return true;
}

export function adImageSrc(ad: AdRecord) {
  return ad.imageId ? `/api/images/${ad.imageId}` : "";
}

export function normalizeAdLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^wa\.me\//i.test(trimmed)) return `https://${trimmed}`;
  return "";
}
