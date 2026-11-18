import { MongoClient, ObjectId } from "mongodb";
import type { GenreRecord, MovieRecord } from "@/lib/types";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "ireberefilm";

if (!uri) throw new Error("MONGODB_URI is missing. Add it to .env.local");

const globalForMongo = globalThis as typeof globalThis & {
  irebereClient?: Promise<MongoClient>;
};

const clientPromise =
  globalForMongo.irebereClient ??
  new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 8000 }).connect();

globalForMongo.irebereClient = clientPromise;

export async function getDb() {
  const client = await clientPromise;
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

export async function getPostersBucket() {
  const db = await getDb();
  const { GridFSBucket } = await import("mongodb");
  return new GridFSBucket(db, { bucketName: "posters" });
}

export function toId(value: unknown) {
  return value instanceof ObjectId ? value.toHexString() : String(value);
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

