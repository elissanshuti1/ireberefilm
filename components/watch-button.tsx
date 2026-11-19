"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { isWatchlisted, toggleWatchlist } from "@/lib/client-library";

type Props = {
  movie: {
    slug: string;
    title: string;
    poster: string;
    genre: string;
    year: number;
  };
};

export default function WatchButton({ movie }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSaved(isWatchlisted(movie.slug)), 0);
    return () => window.clearTimeout(timer);
  }, [movie.slug]);

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleWatchlist(movie))}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition-all hover:border-gold/60 ${
        saved ? "border-gold/50 bg-gold/10 text-gold" : "border-white/15 text-white/60"
      }`}
    >
      <Bookmark className={`size-4 ${saved ? "fill-gold" : ""}`} />
      {saved ? "Byabitswe" : "Bika"}
    </button>
  );
}
