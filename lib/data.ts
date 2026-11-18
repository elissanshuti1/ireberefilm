import { ObjectId } from "mongodb";
import {
  getCommentsCollection,
  getGenresCollection,
  getMoviesCollection,
  getSettingsCollection,
  serializeComment,
  serializeGenre,
  serializeMovie,
} from "@/lib/db";
import { posterSrc } from "@/lib/poster";
import { decodeParam, normalizeSlug } from "@/lib/slug";
import { defaultSettings } from "@/lib/settings";
import type { CommentRecord, GenreRecord, MovieRecord, PublicMovie, SiteSettings } from "@/lib/types";

function toPublic(movie: MovieRecord): PublicMovie {
  return { ...movie, image: posterSrc(movie) };
}

export async function getAllMovies(): Promise<MovieRecord[]> {
  const collection = await getMoviesCollection();
  const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map((doc) => serializeMovie(doc as Record<string, unknown>));
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

export async function getFeaturedMovies(): Promise<PublicMovie[]> {
  const movies = await getPublicMovies();
  return movies.filter((movie) => movie.featured).slice(0, 6);
}

export async function getNewMovies(limit = 8): Promise<PublicMovie[]> {
  const movies = await getPublicMovies();
  return movies.slice(0, limit);
}

export async function getPopularMovies(limit = 6): Promise<PublicMovie[]> {
  const movies = await getPublicMovies();
  return [...movies]
    .sort((a, b) => Number(b.rating) - Number(a.rating))
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

export async function filterPublicMovies(query: string, genre: string): Promise<PublicMovie[]> {
  const movies = await getPublicMovies();
  const q = query.trim().toLowerCase();
  const names = (await getGenres()).map((item) => item.name);
  const validGenre = names.includes(genre) ? genre : "Zose";
  return movies.filter((movie) => {
    const matchesGenre = validGenre === "Zose" || movie.genre === validGenre;
    const matchesQuery =
      !q ||
      movie.title.toLowerCase().includes(q) ||
      movie.originalTitle.toLowerCase().includes(q) ||
      movie.creator.toLowerCase().includes(q) ||
      movie.genre.toLowerCase().includes(q);
    return matchesGenre && matchesQuery;
  });
}
