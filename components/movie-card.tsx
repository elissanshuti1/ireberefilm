import Image from "next/image";
import Link from "next/link";
import { Play, Star } from "lucide-react";
import Reveal from "@/components/reveal";
import type { MovieView } from "@/lib/types";

export default function MovieCard({
  movie,
  index = 0,
  rank,
}: {
  movie: MovieView;
  index?: number;
  rank?: number;
}) {
  return (
    <Reveal delay={Math.min(index, 6) * 0.07} className="h-full">
      <Link href={`/movies/${movie.slug}`} className="group block h-full">
        <div
          className="shine tilt-card relative aspect-[2/3] overflow-hidden rounded-[20px] border border-white/10 bg-ink-3 shadow-[0_20px_50px_-30px_var(--accent)] transition-colors duration-500 group-hover:border-white/25"
          style={{ "--accent": movie.accent } as React.CSSProperties}
        >
          <Image
            src={movie.poster}
            alt={movie.title}
            width={600}
            height={900}
            unoptimized
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.09]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent opacity-90" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
            <Star className="size-3 fill-gold text-gold" />
            {movie.rating}
          </div>
          <span className="absolute top-3 right-3 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-semibold text-white/80 backdrop-blur-md">
            {movie.year}
          </span>

          {rank && (
            <span className="font-display absolute -bottom-4 left-2 text-[110px] leading-none font-extrabold text-white/10 transition-colors duration-500 group-hover:text-gold/20">
              {rank}
            </span>
          )}

          <div className="absolute inset-0 grid place-items-center opacity-0 transition-all duration-500 group-hover:opacity-100">
            <span className="grid size-14 scale-75 place-items-center rounded-full bg-gold text-ink shadow-[0_0_40px_-6px_rgba(247,183,51,0.9)] transition-transform duration-500 group-hover:scale-100">
              <Play className="size-5 translate-x-px fill-ink" />
            </span>
          </div>

          <div className="absolute right-4 bottom-4 left-4 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
            <p className="text-[10px] font-bold tracking-[0.18em] text-gold uppercase">{movie.genre}</p>
            <h3 className="font-display mt-1 line-clamp-2 text-lg leading-tight font-extrabold text-white sm:text-xl">
              {movie.title}
            </h3>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 px-1">
          <p className="truncate text-xs text-white/45">{movie.creator}</p>
          <p className="shrink-0 text-xs text-white/30">{movie.duration}</p>
        </div>
      </Link>
    </Reveal>
  );
}
