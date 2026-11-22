import type { MetadataRoute } from "next";
import { getPublicMovies } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const movies = await getPublicMovies();
  const now = new Date();

  const routes: MetadataRoute.Sitemap = ["/", "/browse", "/about"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.8,
  }));

  for (const movie of movies) {
    const slug = movie.slug?.trim();
    if (!slug) continue;

    const imagePath = movie.image?.trim() ?? "";
    const hasImage =
      (imagePath.startsWith("/") || /^https?:\/\//i.test(imagePath)) &&
      !imagePath.includes("placeholder.svg");
    const image = hasImage ? absoluteUrl(imagePath) : "";
    const modified = new Date(movie.updatedAt || movie.createdAt);
    const lastModified = Number.isNaN(modified.getTime()) ? undefined : modified;

    routes.push({
      url: absoluteUrl(`/movies/${encodeURIComponent(slug)}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "weekly",
      priority: 0.9,
      ...(image ? { images: [image] } : {}),
    });
  }

  const seen = new Set<string>();
  return routes.filter((route) => {
    if (seen.has(route.url)) return false;
    seen.add(route.url);
    return true;
  });
}
