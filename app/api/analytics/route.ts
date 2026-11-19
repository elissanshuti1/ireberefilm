import { NextResponse } from "next/server";
import { getAnalyticsCollection, getMoviesCollection } from "@/lib/db";
import { normalizeSlug } from "@/lib/slug";
import { getOrCreateVisitorId } from "@/lib/visitor";

export const dynamic = "force-dynamic";

const allowedTypes = new Set(["page_view", "movie_view", "movie_click", "playback_error"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type?: unknown;
      path?: unknown;
      slug?: unknown;
      title?: unknown;
      referrer?: unknown;
    };

    const type = allowedTypes.has(String(body.type)) ? String(body.type) : "page_view";
    const rawPath = String(body.path ?? "/");
    const path = rawPath.startsWith("/") ? rawPath.slice(0, 300) : "/";
    const slug = normalizeSlug(String(body.slug ?? "")).slice(0, 120);
    const title = String(body.title ?? "").slice(0, 160);
    const referrer = String(body.referrer ?? "").slice(0, 300);

    const visitorId = await getOrCreateVisitorId();

    if (process.env.MONGODB_URI) {
      let eventTitle = title;
      if (slug && !eventTitle) {
        const movies = await getMoviesCollection();
        const movie = await movies.findOne({ slug }, { projection: { title: 1 } });
        eventTitle = String(movie?.title ?? "");
      }

      const analytics = await getAnalyticsCollection();
      await analytics.insertOne({
        visitorId,
        type,
        path,
        slug,
        title: eventTitle,
        referrer,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
