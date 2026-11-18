import { MongoClient, ObjectId } from "mongodb";
import type {
  AnalyticsEventRecord,
  CommentRecord,
  EpisodeRecord,
  GenreRecord,
  MovieRecord,
} from "@/lib/types";

const dbName = process.env.MONGODB_DB ?? "ireberefilm";

const globalForMongo = globalThis as typeof globalThis & {
  irebereClient?: Promise<MongoClient>;
};

function getClientPromise() {
  if (!globalForMongo.irebereClient) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is missing. Add it to Vercel environment variables");
    globalForMongo.irebereClient = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    }).connect();
  }
  return globalForMongo.irebereClient;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}

export async function getMoviesCollection() {
  const db = await getDb();
  return db.collection("movies");
}

export async function getGenresCollection() {
  const db = await getDb();
  return db.collection("genres");
}

export async function getSettingsCollection() {
  const db = await getDb();
  return db.collection("settings");
}

export async function getCommentsCollection() {
  const db = await getDb();
  const collection = db.collection("comments");
  await collection.createIndex({ movieSlug: 1, pinned: -1, createdAt: -1 });
  return collection;
}

export async function getAnalyticsCollection() {
  const db = await getDb();
  const collection = db.collection("analytics");
  await collection.createIndex({ createdAt: -1 });
  await collection.createIndex({ visitorId: 1 });
  await collection.createIndex({ type: 1, createdAt: -1 });
  return collection;
}

export async function getPostersBucket() {
  const db = await getDb();
  const { GridFSBucket } = await import("mongodb");
  return new GridFSBucket(db, { bucketName: "posters" });
}

export function toId(value: unknown) {
  return value instanceof ObjectId ? value.toHexString() : String(value);
}

function serializeEpisode(doc: Record<string, unknown>, index: number): EpisodeRecord {
  return {
    id: String(doc.id ?? toId(doc._id ?? index)),
    number: Number(doc.number ?? index + 1),
    title: String(doc.title ?? `Igice cya ${index + 1}`),
    playback: doc.playback === "link" ? "link" : "embed",
    embedUrl: doc.embedUrl ? String(doc.embedUrl) : null,
    sourceUrl: String(doc.sourceUrl ?? ""),
  };
}

export function serializeAnalyticsEvent(doc: Record<string, unknown>): AnalyticsEventRecord {
  const type = doc.type === "movie_view" || doc.type === "movie_click" ? doc.type : "page_view";
  return {
    id: toId(doc._id),
    visitorId: String(doc.visitorId ?? ""),
    type,
    path: String(doc.path ?? "/"),
    slug: String(doc.slug ?? ""),
    title: String(doc.title ?? ""),
    referrer: String(doc.referrer ?? ""),
    createdAt: String(doc.createdAt ?? new Date().toISOString()),
  };
}

export function serializeComment(doc: Record<string, unknown>): CommentRecord {
  return {
    id: toId(doc._id),
    movieSlug: String(doc.movieSlug ?? ""),
    name: String(doc.name ?? ""),
    message: String(doc.message ?? ""),
    pinned: Boolean(doc.pinned),
    authorRole: doc.authorRole === "admin" ? "admin" : "viewer",
    createdAt: String(doc.createdAt ?? new Date().toISOString()),
  };
}

export function serializeMovie(doc: Record<string, unknown>): MovieRecord {
  return {
    id: toId(doc._id),
    slug: String(doc.slug ?? ""),
    title: String(doc.title ?? ""),
    originalTitle: String(doc.originalTitle ?? ""),
    synopsis: String(doc.synopsis ?? ""),
    posterId: doc.posterId ? toId(doc.posterId) : null,
    posterUrl: doc.posterUrl ? String(doc.posterUrl) : null,
    genre: String(doc.genre ?? "Drama"),
    year: Number(doc.year ?? 0),
    duration: String(doc.duration ?? ""),
    rating: String(doc.rating ?? "0"),
    creator: String(doc.creator ?? ""),
    source: String(doc.source ?? ""),
    sourceUrl: String(doc.sourceUrl ?? "#"),
    playback: doc.playback === "embed" ? "embed" : "link",
    embedUrl: doc.embedUrl ? String(doc.embedUrl) : null,
    isSeason: Boolean(doc.isSeason),
    hasParts: Boolean(doc.hasParts),
    episodes: Array.isArray(doc.episodes)
      ? doc.episodes.map((episode, index) =>
          serializeEpisode(episode as Record<string, unknown>, index),
        )
      : [],
    featured: Boolean(doc.featured),
    published: doc.published !== false,
    linkStatus:
      doc.linkStatus === "ok" || doc.linkStatus === "broken" ? doc.linkStatus : "unknown",
    lastCheckedAt: doc.lastCheckedAt ? String(doc.lastCheckedAt) : null,
    brokenReports: Number(doc.brokenReports ?? 0),
    createdAt: String(doc.createdAt ?? new Date().toISOString()),
    updatedAt: String(doc.updatedAt ?? new Date().toISOString()),
  };
}

export function serializeGenre(doc: Record<string, unknown>): GenreRecord {
  return {
    id: toId(doc._id),
    name: String(doc.name ?? ""),
    slug: String(doc.slug ?? ""),
    color: String(doc.color ?? "#f7b733"),
    order: Number(doc.order ?? 0),
  };
}

