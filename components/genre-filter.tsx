"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function GenreFilter({
  genres,
  active,
  query,
}: {
  genres: string[];
  active: string;
  query: string;
}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (active !== "Zose") params.set("genre", active);
  const suffix = params.toString();

  return (
    <div className="mask-fade-x -mx-5 flex gap-2 overflow-x-auto px-5 py-2 sm:mx-0 sm:px-0">
      {genres.map((genre) => {
        const isActive = genre === active;
        const targetParams = new URLSearchParams();
        if (query) targetParams.set("q", query);
        if (genre !== "Zose") targetParams.set("genre", genre);
        const target = `/browse${targetParams.size ? `?${targetParams}` : ""}`;

        return (
          <Link
            key={genre}
            href={target}
            className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-300 ${
              isActive ? "text-ink" : "text-white/55 hover:text-white"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="active-genre"
                className="absolute inset-0 rounded-full bg-gold"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{genre}</span>
          </Link>
        );
      })}
      {suffix && <span className="sr-only">Filteri: {suffix}</span>}
    </div>
  );
}
