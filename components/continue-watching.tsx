"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Clock, Play, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import SectionHeading from "@/components/section-heading";
import { getProgress, getWatchlist, removeFromLibrary, type LibraryMovie } from "@/lib/client-library";

export default function ContinueWatching() {
  const [tab, setTab] = useState<"progress" | "watchlist">("progress");
  const [progress, setProgress] = useState<LibraryMovie[]>([]);
  const [watchlist, setWatchlist] = useState<LibraryMovie[]>([]);

  useEffect(() => {
    const sync = () => {
      setProgress(getProgress());
      setWatchlist(getWatchlist());
    };
    const timer = window.setTimeout(sync, 0);
    window.addEventListener("storage", sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const items = tab === "progress" ? progress : watchlist;
  if (items.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Byoroshye kugaruka"
            title={tab === "progress" ? "Komeza kureba" : "Ibyo wabitswe"}
            description="Bibikiwe muri iyi browser yawe kugira ubone filime wasize hagati."
          />
          <div className="flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setTab("progress")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                tab === "progress" ? "bg-gold text-ink" : "text-white/50 hover:text-white"
              }`}
            >
              <Clock className="size-3.5" /> Komeza
            </button>
            <button
              type="button"
              onClick={() => setTab("watchlist")}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                tab === "watchlist" ? "bg-gold text-ink" : "text-white/50 hover:text-white"
              }`}
            >
              <Bookmark className="size-3.5" /> Byabitswe
              {watchlist.length > 0 && <span>{watchlist.length}</span>}
            </button>
          </div>
        </div>

        <div className="mask-fade-x -mx-5 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 sm:mx-0 sm:px-0">
          {items.map((item) => (
            <div key={item.slug} className="w-[52vw] shrink-0 snap-start sm:w-[32vw] lg:w-[20%]">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-3">
                <Link href={`/movies/${item.slug}`} className="relative block aspect-[2/3]">
                  <Image
                    src={item.poster}
                    alt={item.title}
                    width={600}
                    height={900}
                    unoptimized
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                  <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-gold/90 text-ink">
                    <Play className="size-4 translate-x-px fill-ink" />
                  </span>
                  {item.episode && (
                    <span className="absolute top-3 left-3 max-w-[85%] truncate rounded-full border border-gold/30 bg-black/50 px-2.5 py-1 text-[10px] font-bold text-gold backdrop-blur-md">
                      {item.episode}
                    </span>
                  )}
                </Link>
                <div className="flex items-end justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <Link href={`/movies/${item.slug}`} className="block truncate text-sm font-bold hover:text-gold">
                      {item.title}
                    </Link>
                    <p className="mt-1 truncate text-[11px] text-white/35">
                      {item.genre} · {item.year}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeFromLibrary(item.slug);
                      setProgress(getProgress());
                      setWatchlist(getWatchlist());
                    }}
                    aria-label={`Siba ${item.title}`}
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-white/30 hover:text-rose-300"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
