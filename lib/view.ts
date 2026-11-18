import type { MovieView, PublicMovie } from "@/lib/types";

export function toMovieView(movie: PublicMovie, color = "#f7b733"): MovieView {
  return {
    ...movie,
    poster: movie.image,
    accent: color,
    glow: color,
    tagline: movie.synopsis,
    kicker: "Agasobanuye",
  };
}

export function toMovieViews(
  movies: PublicMovie[],
  colors: Record<string, string> = {},
): MovieView[] {
  return movies.map((movie) => toMovieView(movie, colors[movie.genre]));
}
