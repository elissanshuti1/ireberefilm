export type PublicMovie = MovieRecord & { image: string };

export type MovieView = PublicMovie & {
  poster: string;
  accent: string;
  glow: string;
  tagline: string;
  kicker: string;
};

export type MovieRecord = {
  id: string;
  slug: string;
  title: string;
  originalTitle: string;
  synopsis: string;
  posterId: string | null;
  posterUrl: string | null;
  genre: string;
  year: number;
  duration: string;
  rating: string;
  creator: string;
  source: string;
  sourceUrl: string;
  playback: "embed" | "link";
  embedUrl: string | null;
  featured: boolean;
  published: boolean;
  linkStatus: "ok" | "broken" | "unknown";
  lastCheckedAt: string | null;
  brokenReports: number;
  createdAt: string;
  updatedAt: string;
};

export type GenreRecord = {
  id: string;
  name: string;
  slug: string;
  color: string;
  order: number;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  heroCta: string;
  heroSecondary: string;
  newTitle: string;
  popularTitle: string;
  categoriesTitle: string;
  searchPlaceholder: string;
  aboutIntro: string;
  footerText: string;
  contactEmail: string;
};
