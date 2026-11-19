"use client";

import { useEffect } from "react";
import { saveProgress } from "@/lib/client-library";

export default function ProgressRecorder({
  movie,
}: {
  movie: {
    slug: string;
    title: string;
    poster: string;
    genre: string;
    year: number;
  };
}) {
  useEffect(() => {
    saveProgress(movie);

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const element = target?.closest?.("[data-watch-episode]");
      const episode = element?.getAttribute("data-watch-episode");
      if (episode) saveProgress(movie, episode);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [movie]);

  return null;
}
