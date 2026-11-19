import { MongoClient, ObjectId } from "mongodb";
import {
  defaultAdDurationSeconds,
  isAdPlacement,
  isAdPopupFrequency,
  normalizeAdLink,
} from "@/lib/ads";
import type {
  AdEventRecord,
  AdRecord,
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
  await collection.createIndex({ movieSlug: 1, parentId: 1, pinned: -1, createdAt: -1 });
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

export async function getAdsCollection() {
  const db = await getDb();
  const collection = db.collection("ads");
  await collection.createIndex({ active: 1, priority: -1, createdAt: -1 });
  return collection;
}

export async function getAdEventsCollection() {
  const db = await getDb();
  const collection = db.collection("ad_events");
  await collection.createIndex({ adId: 1, createdAt: -1 });
  await collection.createIndex({ adId: 1, visitorId: 1, type: 1 });
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

export function serializeAd(doc: Record<string, unknown>): AdRecord {
  const placements = Array.isArray(doc.placements)
    ? doc.placements.map(String).filter(isAdPlacement)
    : [];
  const duration = Number(doc.durationSeconds ?? defaultAdDurationSeconds);
  const frequency = String(doc.popupFrequency ?? "per_visit");
  return {
    id: toId(doc._id),
    advertiser: String(doc.advertiser ?? ""),
    title: String(doc.title ?? ""),
    message: String(doc.message ?? ""),
    imageId: doc.imageId ? toId(doc.imageId) : null,
    link: normalizeAdLink(String(doc.link ?? "")),
    ctaLabel: String(doc.ctaLabel ?? "Reba byinshi"),
    placements,
    active: Boolean(doc.active),
    popupFrequency: isAdPopupFrequency(frequency) ? frequency : "per_visit",
    durationSeconds: Number.isFinite(duration) ? Math.min(Math.max(Math.trunc(duration), 3), 120) : defaultAdDurationSeconds,
    priority: Number(doc.priority ?? 0),
    startAt: String(doc.startAt ?? ""),
    endAt: String(doc.endAt ?? ""),
    views: Number(doc.views ?? 0),
    clicks: Number(doc.clicks ?? 0),
    uniqueViews: Number(doc.uniqueViews ?? 0),
    createdAt: String(doc.createdAt ?? new Date().toISOString()),
    updatedAt: String(doc.updatedAt ?? new Date().toISOString()),
  };
}

export function serializeAdEvent(doc: Record<string, unknown>): AdEventRecord {
  return {
    id: toId(doc._id),
    adId: String(doc.adId ?? ""),
    type: doc.type === "click" ? "click" : "view",
    placement: String(doc.placement ?? ""),
    visitorId: String(doc.visitorId ?? ""),
    path: String(doc.path ?? "/"),
    createdAt: String(doc.createdAt ?? new Date().toISOString()),
  };
}

export function serializeAnalyticsEvent(doc: Record<string, unknown>): AnalyticsEventRecord {
  const type =
    doc.type === "movie_view" ||
    doc.type === "movie_click" ||
    doc.type === "playback_error"
      ? doc.type
      : "page_view";
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
  const status = doc.status === "reported" || doc.status === "hidden" ? doc.status : "approved";
  return {
    id: toId(doc._id),
    movieSlug: String(doc.movieSlug ?? ""),
    name: String(doc.name ?? ""),
    message: String(doc.message ?? ""),
    pinned: Boolean(doc.pinned),
    authorRole: doc.authorRole === "admin" ? "admin" : "viewer",
    visitorId: String(doc.visitorId ?? ""),
    parentId: doc.parentId ? String(doc.parentId) : null,
    likedBy: Array.isArray(doc.likedBy) ? doc.likedBy.map(String) : [],
    reportedBy: Array.isArray(doc.reportedBy) ? doc.reportedBy.map(String) : [],
    status,
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
    homeOrder:
      typeof doc.homeOrder === "number" && Number.isFinite(doc.homeOrder)
        ? Math.trunc(doc.homeOrder)
        : null,
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

