export type LibraryMovie = {
  slug: string;
  title: string;
  poster: string;
  genre: string;
  year: number;
  updatedAt: string;
  episode?: string;
};

const watchlistKey = "irebere_watchlist";
const progressKey = "irebere_progress";

function read(key: string): LibraryMovie[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LibraryMovie[];
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.slug === "string")
      : [];
  } catch {
    return [];
  }
}

function write(key: string, items: LibraryMovie[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

export function getWatchlist() {
  return read(watchlistKey);
}

export function getProgress() {
  return read(progressKey);
}

export function isWatchlisted(slug: string) {
  return getWatchlist().some((item) => item.slug === slug);
}

export function toggleWatchlist(movie: Omit<LibraryMovie, "updatedAt" | "episode">) {
  const items = getWatchlist();
  const exists = items.some((item) => item.slug === movie.slug);
  const next = exists
    ? items.filter((item) => item.slug !== movie.slug)
    : [{ ...movie, updatedAt: new Date().toISOString() }, ...items];
  write(watchlistKey, next);
  return !exists;
}

export function saveProgress(movie: Omit<LibraryMovie, "updatedAt" | "episode">, episode?: string) {
  const next = [
    { ...movie, episode, updatedAt: new Date().toISOString() },
    ...getProgress().filter((item) => item.slug !== movie.slug),
  ].slice(0, 20);
  write(progressKey, next);
}

export function removeFromLibrary(slug: string) {
  write(
    watchlistKey,
    getWatchlist().filter((item) => item.slug !== slug),
  );
  write(
    progressKey,
    getProgress().filter((item) => item.slug !== slug),
  );
}
