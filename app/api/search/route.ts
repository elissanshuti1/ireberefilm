import { NextResponse } from "next/server";
import { getPublicMovies } from "@/lib/data";
import type { MovieSearchResult } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams.get("q")?.trim().toLowerCase() ?? "";
    if (!query || !process.env.MONGODB_URI) {
      return NextResponse.json({ results: [] satisfies MovieSearchResult[] });
    }

    const movies = await getPublicMovies();
    const scored = movies
      .map((movie) => {
        const title = movie.title.toLowerCase();
        const originalTitle = movie.originalTitle.toLowerCase();
        const creator = movie.creator.toLowerCase();
        const genre = movie.genre.toLowerCase();
        const synopsis = movie.synopsis.toLowerCase();
        const matches =
          title.includes(query) ||
          originalTitle.includes(query) ||
          creator.includes(query) ||
          genre.includes(query) ||
          synopsis.includes(query);
        if (!matches) return null;

        const score = title.startsWith(query)
          ? 5
          : title.includes(query)
            ? 4
            : originalTitle.startsWith(query)
              ? 3
              : creator.includes(query)
                ? 2
                : genre.includes(query)
                  ? 1
                  : 0;

        return { movie, score };
      })
      .filter((entry): entry is { movie: (typeof movies)[number]; score: number } => entry !== null)
      .sort((a, b) => b.score - a.score || b.movie.createdAt.localeCompare(a.movie.createdAt))
      .slice(0, 8)
      .map<MovieSearchResult>(({ movie }) => ({
        slug: movie.slug,
        title: movie.title,
        originalTitle: movie.originalTitle,
        creator: movie.creator,
        genre: movie.genre,
        year: movie.year,
        image: movie.image,
      }));

    return NextResponse.json({ results: scored });
  } catch {
    return NextResponse.json({ results: [] satisfies MovieSearchResult[] });
  }
}
