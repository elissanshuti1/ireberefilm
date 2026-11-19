"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import MovieCard from "@/components/movie-card";
import Reveal from "@/components/reveal";
import { getWatchlist } from "@/lib/client-library";
import type { MovieView } from "@/lib/types";

export default function BrowseResults({
  movies,
  watchlistOnly,
}: {
  movies: MovieView[];
  watchlistOnly: boolean;
}) {
  const [visible, setVisible] = useState(movies);

  useEffect(() => {
    const sync = () => {
      const saved = new Set(getWatchlist().map((item) => item.slug));
      setVisible(watchlistOnly ? movies.filter((movie) => saved.has(movie.slug)) : movies);
    };
    const timer = window.setTimeout(sync, 0);
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", sync);
    };
  }, [movies, watchlistOnly]);

  return (
    <>
      <div className="mt-8 flex items-center justify-between text-sm text-white/40">
        <p>
          <span className="font-bold text-white">{visible.length}</span> filime ziboneka
        </p>
        {watchlistOnly && <p className="text-gold">Ibyabitswe gusa</p>}
      </div>

      {visible.length > 0 ? (
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
          {visible.map((movie, index) => (
            <MovieCard key={movie.slug} movie={movie} index={index} />
          ))}
        </div>
      ) : (
        <Reveal className="mt-10">
          <div className="glass-soft flex flex-col items-center rounded-3xl px-6 py-20 text-center">
            <span className="grid size-20 place-items-center rounded-3xl bg-gold/10 text-gold">
              <Search className="size-8" />
            </span>
            <h2 className="font-display mt-6 text-2xl font-extrabold">Nta filime yaboneka</h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-white/45">
              {watchlistOnly
                ? "Nta filime wabitswe muri iyi browser. Kanda Bika kuri filime uyiteze."
                : "Gerageza izindi jambo, cyangwa hitamo icyiciro gitandukanye."}
            </p>
          </div>
        </Reveal>
      )}
    </>
  );
}
