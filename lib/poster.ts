import type { MovieRecord } from "@/lib/types";

export function posterSrc(movie: MovieRecord) {
  return movie.posterUrl || (movie.posterId ? `/api/images/${movie.posterId}` : "/posters/placeholder.svg");
}
