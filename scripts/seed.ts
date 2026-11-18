import { readFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { GridFSBucket, MongoClient, ObjectId } from "mongodb";
import { genres, movies } from "../lib/movies";
import { defaultSettings } from "../lib/settings";

const colors = ["#f7b733", "#f59e0b", "#0ea5e9", "#db2777", "#7c3aed", "#059669"];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing");

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB ?? "ireberefilm");
  const movieCollection = db.collection("movies");
  const genreCollection = db.collection("genres");
  const settingsCollection = db.collection("settings");
  const bucket = new GridFSBucket(db, { bucketName: "posters" });

  async function uploadPoster(filename: string) {
    const filePath = path.join(process.cwd(), "public", "posters", path.basename(filename));
    const buffer = await readFile(filePath);
    return new Promise<string>((resolve, reject) => {
      const upload = bucket.openUploadStream(path.basename(filename), {
        metadata: { contentType: "image/svg+xml" },
      });
      Readable.from(buffer).pipe(upload);
      upload.on("finish", () => resolve(upload.id.toHexString()));
      upload.on("error", reject);
    });
  }

  for (const movie of movies) {
    const existing = await movieCollection.findOne({ slug: movie.slug });
    if (existing?.posterId && ObjectId.isValid(String(existing.posterId))) {
      try {
        await bucket.delete(new ObjectId(String(existing.posterId)));
      } catch {
        console.log("Could not remove old poster for", movie.slug);
      }
    }

    const posterId = await uploadPoster(movie.poster);
    const now = new Date().toISOString();
    await movieCollection.updateOne(
      { slug: movie.slug },
      {
        $set: {
          slug: movie.slug,
          title: movie.title,
          originalTitle: movie.originalTitle,
          synopsis: movie.synopsis,
          posterId,
          posterUrl: null,
          genre: movie.genre,
          year: movie.year,
          duration: movie.duration,
          rating: movie.rating,
          creator: movie.creator,
          source: movie.source,
          sourceUrl: movie.sourceUrl,
          playback: movie.playback,
          embedUrl: movie.embedUrl ?? null,
          isSeason: false,
          episodes: [],
          featured: Boolean(movie.featured),
          published: true,
          linkStatus: "unknown",
          lastCheckedAt: null,
          brokenReports: 0,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true },
    );
  }

  const genreNames = genres.filter((genre) => genre !== "Zose");
  for (const [index, name] of genreNames.entries()) {
    await genreCollection.updateOne(
      { name },
      {
        $set: {
          name,
          slug: name.toLowerCase(),
          color: colors[index % colors.length],
          order: index,
        },
      },
      { upsert: true },
    );
  }

  await settingsCollection.updateOne(
    { key: "site" },
    { $set: { ...defaultSettings, key: "site" } },
    { upsert: true },
  );

  console.log(`Seeded ${movies.length} movies, ${genreNames.length} genres, and site settings.`);
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
