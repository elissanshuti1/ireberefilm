import { ObjectId } from "mongodb";
import {
  getAnalyticsCollection,
  getCommentsCollection,
  getGenresCollection,
  getMoviesCollection,
  getSettingsCollection,
  serializeAnalyticsEvent,
  serializeComment,
  serializeGenre,
  serializeMovie,
} from "@/lib/db";
import { posterSrc } from "@/lib/poster";
import { decodeParam, normalizeSlug } from "@/lib/slug";
import { defaultSettings } from "@/lib/settings";
import type {
  AnalyticsEventRecord,
  AnalyticsSummary,
  CommentRecord,
  CommentView,
  GenreRecord,
  GlobalComment,
  MovieAnalyticsSummary,
  MovieRecord,
  PublicMovie,
  SiteSettings,
  VisitorSummary,
} from "@/lib/types";

function toPublic(movie: MovieRecord): PublicMovie {
  return { ...movie, image: posterSrc(movie) };
}

export async function getAllMovies(): Promise<MovieRecord[]> {
  const collection = await getMoviesCollection();
  const docs = await collection.find({}).toArray();
  return docs
    .map((doc) => serializeMovie(doc as Record<string, unknown>))
    .sort((a, b) => {
      if (a.homeOrder !== null && b.homeOrder !== null) {
        const orderDiff = a.homeOrder - b.homeOrder;
        if (orderDiff !== 0) return orderDiff;
      }
      if (a.homeOrder !== null && b.homeOrder === null) return -1;
      if (a.homeOrder === null && b.homeOrder !== null) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
}

export async function getPublicMovies(): Promise<PublicMovie[]> {
  const movies = await getAllMovies();
  return movies.filter((movie) => movie.published).map(toPublic);
}

export async function getMovieBySlug(slug: string): Promise<PublicMovie | null> {
  const decoded = decodeParam(slug);
  const candidates = Array.from(
    new Set([slug, decoded, normalizeSlug(decoded)].filter(Boolean)),
  );
  const collection = await getMoviesCollection();
  for (const candidate of candidates) {
    const doc = await collection.findOne({ slug: candidate });
    if (doc) return toPublic(serializeMovie(doc as Record<string, unknown>));
  }
  return null;
}

export async function getMovieById(id: string): Promise<MovieRecord | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getMoviesCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? serializeMovie(doc as Record<string, unknown>) : null;
}

export async function getCommentsBySlug(slug: string, limit = 0): Promise<CommentRecord[]> {
  const collection = await getCommentsCollection();
  const cursor = collection.find({ movieSlug: slug }).sort({ pinned: -1, createdAt: -1 });
  const docs = await (limit > 0 ? cursor.limit(limit) : cursor).toArray();
  return docs.map((doc) => serializeComment(doc as Record<string, unknown>));
}

export async function getCommentViewsBySlug(
  slug: string,
  visitorId: string | null,
): Promise<CommentView[]> {
  const comments = (await getCommentsBySlug(slug)).filter(
    (comment) => comment.status !== "hidden",
  );
  const views = new Map<string, CommentView>();

  for (const comment of comments) {
    views.set(comment.id, {
      id: comment.id,
      movieSlug: comment.movieSlug,
      name: comment.name,
      message: comment.message,
      pinned: comment.pinned,
      authorRole: comment.authorRole,
      status: comment.status,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      likeCount: comment.likedBy.length,
      likedByMe: Boolean(visitorId && comment.likedBy.includes(visitorId)),
      reportedByMe: Boolean(visitorId && comment.reportedBy.includes(visitorId)),
      replies: [],
    });
  }

  const roots: CommentView[] = [];
  for (const comment of comments) {
    const view = views.get(comment.id);
    if (!view) continue;
    const parent = comment.parentId ? views.get(comment.parentId) : undefined;
    if (parent) parent.replies.push(view);
    else roots.push(view);
  }

  for (const view of views.values()) {
    view.replies.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  return roots.sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) ||
      b.likeCount - a.likeCount ||
      b.createdAt.localeCompare(a.createdAt),
  );
}

export async function getReportedComments(): Promise<CommentRecord[]> {
  if (!process.env.MONGODB_URI) return [];
  const collection = await getCommentsCollection();
  const docs = await collection.find({ status: "reported" }).sort({ createdAt: -1 }).toArray();
  return docs.map((doc) => serializeComment(doc as Record<string, unknown>));
}

export async function getAllComments(): Promise<CommentRecord[]> {
  if (!process.env.MONGODB_URI) return [];
  const collection = await getCommentsCollection();
  const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((doc) => serializeComment(doc as Record<string, unknown>));
}

export async function getGlobalPinnedComment(): Promise<GlobalComment | null> {
  if (!process.env.MONGODB_URI) return null;
  try {
    const collection = await getSettingsCollection();
    const doc = await collection.findOne({ key: "pinnedComment" });
    if (!doc) return null;
    const data = doc as Record<string, unknown>;
    const message = String(data.message ?? "").trim();
    if (!message) return null;
    return {
      name: String(data.name ?? "Ireberefilm"),
      message,
      updatedAt: String(data.updatedAt ?? new Date().toISOString()),
    };
  } catch {
    return null;
  }
}

export async function getAnalyticsEvents(limit = 0): Promise<AnalyticsEventRecord[]> {
  if (!process.env.MONGODB_URI) return [];
  const collection = await getAnalyticsCollection();
  const cursor = collection.find({}).sort({ createdAt: -1 });
  const docs = await (limit > 0 ? cursor.limit(limit) : cursor).toArray();
  return docs.map((doc) => serializeAnalyticsEvent(doc as Record<string, unknown>));
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const events = await getAnalyticsEvents();
  const visitors = new Map<string, VisitorSummary>();
  const movies = new Map<string, MovieAnalyticsSummary>();
  const today = new Date().toISOString().slice(0, 10);
  let visits = 0;
  let movieViews = 0;
  let movieClicks = 0;
  let playbackErrors = 0;
  let todayVisits = 0;

  for (const event of events) {
    const visitorKey = event.visitorId || "anonymous";
    const visitor = visitors.get(visitorKey) ?? {
      id: visitorKey,
      visits: 0,
      movieViews: 0,
      clicks: 0,
      lastSeen: event.createdAt,
      lastPath: event.path,
    };

    if (event.createdAt > visitor.lastSeen) {
      visitor.lastSeen = event.createdAt;
      visitor.lastPath = event.path;
    }

    if (event.type === "page_view") {
      visits += 1;
      visitor.visits += 1;
      visitor.lastPath = event.path;
      if (event.createdAt.slice(0, 10) === today) todayVisits += 1;
    } else if (event.type === "movie_view") {
      movieViews += 1;
      visitor.movieViews += 1;
    } else if (event.type === "movie_click") {
      movieClicks += 1;
      visitor.clicks += 1;
    } else {
      playbackErrors += 1;
    }

    visitors.set(visitorKey, visitor);

    if (event.slug) {
      const movie = movies.get(event.slug) ?? {
        slug: event.slug,
        title: event.title || event.slug,
        views: 0,
        clicks: 0,
      };
      if (event.type === "movie_view") movie.views += 1;
      if (event.type === "movie_click") movie.clicks += 1;
      movies.set(event.slug, movie);
    }
  }

  return {
    visits,
    uniqueVisitors: visitors.size,
    movieViews,
    movieClicks,
    playbackErrors,
    todayVisits,
    visitors: [...visitors.values()]
      .sort((a, b) => b.lastSeen.localeCompare(a.lastSeen))
      .slice(0, 20),
    movies: [...movies.values()]
      .sort((a, b) => b.views + b.clicks - (a.views + a.clicks))
      .slice(0, 10),
    activity: events.filter((event) => event.type !== "page_view").slice(0, 20),
  };
}

export async function getFeaturedMovies(): Promise<PublicMovie[]> {
  const movies = await getPublicMovies();
  return movies.filter((movie) => movie.featured).slice(0, 6);
}

export async function getNewMovies(limit = 8): Promise<PublicMovie[]> {
  const movies = await getPublicMovies();
  return movies.slice(0, limit);
}

export async function getPopularMovies(limit = 6): Promise<PublicMovie[]> {
  const [movies, analytics] = await Promise.all([getPublicMovies(), getAnalyticsSummary()]);
  const scores = new Map(analytics.movies.map((item) => [item.slug, item.views * 2 + item.clicks]));
  return [...movies]
    .sort((a, b) => {
      const scoreDifference = (scores.get(b.slug) ?? 0) - (scores.get(a.slug) ?? 0);
      if (scoreDifference !== 0) return scoreDifference;
      const ratingDifference = Number(b.rating) - Number(a.rating);
      if (ratingDifference !== 0) return ratingDifference;
      return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
    })
    .slice(0, limit);
}

export async function getGenres(): Promise<GenreRecord[]> {
  const collection = await getGenresCollection();
  const docs = await collection.find({}).sort({ order: 1 }).toArray();
  const genres = docs.map((doc) => serializeGenre(doc as Record<string, unknown>));
  if (genres.length) return genres;
  const names = Array.from(new Set((await getAllMovies()).map((movie) => movie.genre)));
  return names.map((name, index) => ({
    id: name,
    name,
    slug: name.toLowerCase(),
    color: "#f7b733",
    order: index,
  }));
}

export async function getSettings(): Promise<SiteSettings> {
  if (!process.env.MONGODB_URI) return defaultSettings;
  try {
    const collection = await getSettingsCollection();
    const doc = await collection.findOne({ key: "site" });
    if (!doc) return defaultSettings;
    const data = doc as Record<string, unknown>;
    return {
      siteName: String(data.siteName ?? defaultSettings.siteName),
      tagline: String(data.tagline ?? defaultSettings.tagline),
      heroCta: String(data.heroCta ?? defaultSettings.heroCta),
      heroSecondary: String(data.heroSecondary ?? defaultSettings.heroSecondary),
      newTitle: String(data.newTitle ?? defaultSettings.newTitle),
      popularTitle: String(data.popularTitle ?? defaultSettings.popularTitle),
      categoriesTitle: String(data.categoriesTitle ?? defaultSettings.categoriesTitle),
      searchPlaceholder: String(data.searchPlaceholder ?? defaultSettings.searchPlaceholder),
      aboutIntro: String(data.aboutIntro ?? defaultSettings.aboutIntro),
      footerText: String(data.footerText ?? defaultSettings.footerText),
      contactEmail: String(data.contactEmail ?? defaultSettings.contactEmail),
    };
  } catch {
    return defaultSettings;
  }
}

export async function getDashboardStats() {
  const movies = await getAllMovies();
  const genres = await getGenres();
  return {
    total: movies.length,
    published: movies.filter((movie) => movie.published).length,
    featured: movies.filter((movie) => movie.featured).length,
    broken: movies.filter((movie) => movie.linkStatus === "broken" || movie.brokenReports > 0).length,
    genres: genres.length,
  };
}

export type MovieFilterOptions = {
  kind?: string;
  year?: string;
  creator?: string;
  sort?: string;
};

export async function filterPublicMovies(
  query: string,
  genre: string,
  options: MovieFilterOptions = {},
): Promise<PublicMovie[]> {
  const [movies, names] = await Promise.all([getPublicMovies(), getGenres().then((items) => items.map((item) => item.name))]);
  const q = query.trim().toLowerCase();
  const validGenre = names.includes(genre) ? genre : "Zose";
  const kind = options.kind ?? "all";
  const sort = options.sort ?? "latest";
  const filtered = movies.filter((movie) => {
    const matchesGenre = validGenre === "Zose" || movie.genre === validGenre;
    const matchesQuery =
      !q ||
      movie.title.toLowerCase().includes(q) ||
      movie.originalTitle.toLowerCase().includes(q) ||
      movie.creator.toLowerCase().includes(q) ||
      movie.genre.toLowerCase().includes(q);
    const matchesKind =
      kind === "all" ||
      (kind === "season" && movie.isSeason) ||
      (kind === "part" && movie.hasParts && !movie.isSeason) ||
      (kind === "movie" && !movie.isSeason && !movie.hasParts);
    const matchesYear = !options.year || String(movie.year) === options.year;
    const matchesCreator = !options.creator || movie.creator === options.creator;
    return matchesGenre && matchesQuery && matchesKind && matchesYear && matchesCreator;
  });

  if (sort === "title") {
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sort === "rating") {
    return filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
  }
  if (sort === "popular") {
    const analytics = await getAnalyticsSummary();
    const scores = new Map(analytics.movies.map((item) => [item.slug, item.views * 2 + item.clicks]));
    return filtered.sort((a, b) => (scores.get(b.slug) ?? 0) - (scores.get(a.slug) ?? 0));
  }
  return filtered;
}
