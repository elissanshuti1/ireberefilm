export type PublicMovie = MovieRecord & { image: string };

export type MovieView = PublicMovie & {
  poster: string;
  accent: string;
  glow: string;
  tagline: string;
  kicker: string;
};

export type EpisodeRecord = {
  id: string;
  number: number;
  title: string;
  playback: "embed" | "link";
  embedUrl: string | null;
  sourceUrl: string;
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
  isSeason: boolean;
  hasParts: boolean;
  episodes: EpisodeRecord[];
  featured: boolean;
  published: boolean;
  linkStatus: "ok" | "broken" | "unknown";
  lastCheckedAt: string | null;
  brokenReports: number;
  homeOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CommentRecord = {
  id: string;
  movieSlug: string;
  name: string;
  message: string;
  pinned: boolean;
  authorRole: "admin" | "viewer";
  createdAt: string;
};

export type AnalyticsEventRecord = {
  id: string;
  visitorId: string;
  type: "page_view" | "movie_view" | "movie_click";
  path: string;
  slug: string;
  title: string;
  referrer: string;
  createdAt: string;
};

export type VisitorSummary = {
  id: string;
  visits: number;
  movieViews: number;
  clicks: number;
  lastSeen: string;
  lastPath: string;
};

export type MovieAnalyticsSummary = {
  slug: string;
  title: string;
  views: number;
  clicks: number;
};

export type AnalyticsSummary = {
  visits: number;
  uniqueVisitors: number;
  movieViews: number;
  movieClicks: number;
  todayVisits: number;
  visitors: VisitorSummary[];
  movies: MovieAnalyticsSummary[];
  activity: AnalyticsEventRecord[];
};

export type GlobalComment = {
  name: string;
  message: string;
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
