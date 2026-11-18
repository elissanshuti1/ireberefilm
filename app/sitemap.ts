import type { MetadataRoute } from "next";
import { getGenres, getPublicMovies } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [movies, genres] = await Promise.all([getPublicMovies(), getGenres()]);

  const staticRoutes: MetadataRoute.Sitemap = ["/", "/browse", "/about"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.8,
  }));

  const movieRoutes: MetadataRoute.Sitemap = movies.map((movie) => ({
    url: absoluteUrl(`/movies/${encodeURIComponent(movie.slug)}`),
    lastModified: new Date(movie.updatedAt || movie.createdAt),
    changeFrequency: "weekly",
    priority: 0.9,
    images: [absoluteUrl(movie.image)],
  }));

  const genreRoutes: MetadataRoute.Sitemap = genres.map((genre) => ({
    url: absoluteUrl(`/browse?genre=${encodeURIComponent(genre.name)}`),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...movieRoutes, ...genreRoutes];
}
