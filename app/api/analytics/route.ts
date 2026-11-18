import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAnalyticsCollection, getMoviesCollection } from "@/lib/db";
import { normalizeSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

const allowedTypes = new Set(["page_view", "movie_view", "movie_click"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

    const cookieStore = await cookies();
    const existingId = cookieStore.get("irebere_visitor")?.value;
    const visitorId = existingId && uuidPattern.test(existingId) ? existingId : randomUUID();
    cookieStore.set({
      name: "irebere_visitor",
      value: visitorId,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

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
