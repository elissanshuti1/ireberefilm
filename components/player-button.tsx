"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { reportBrokenAction } from "@/lib/actions";
import type { MovieView } from "@/lib/types";

type WatchData = Pick<MovieView, "slug" | "title" | "poster" | "creator" | "embedUrl">;

export default function PlayerButton({
  movie,
  label = "Tangira Kureba",
  subtitle,
  progressLabel,
}: {
  movie: WatchData;
  label?: string;
  subtitle?: string;
  progressLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setStarted(false);
  };

  if (!movie.embedUrl) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-watch-episode={progressLabel}
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-8 py-4 text-sm font-extrabold text-ink shadow-[0_20px_60px_-22px_rgba(247,183,51,0.95)] transition-transform duration-300 hover:scale-[1.04]"
      >
        <span className="pulse-ring absolute inset-0 rounded-full bg-white/30" />
        <span className="relative grid size-9 place-items-center rounded-full bg-ink/10 transition-transform duration-300 group-hover:scale-110">
          <Play className="size-4 translate-x-px fill-ink" />
        </span>
        <span className="relative">{label}</span>
        <ArrowUpRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 px-4 py-10 backdrop-blur-xl"
            onClick={close}
            aria-label="Kureba filime"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="glass relative w-full max-w-4xl overflow-hidden rounded-3xl border-white/15 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Ireberefilm Player</p>
                  <p className="font-display mt-1 text-lg font-bold">{subtitle ?? movie.title}</p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="grid size-10 place-items-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                  aria-label="Funga player"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="relative aspect-video bg-black">
                <AnimatePresence mode="wait">
                  {started ? (
                    <motion.div
                      key="frame"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0"
                    >
                      <iframe
                        src={movie.embedUrl}
                        title={movie.title}
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        referrerPolicy="no-referrer"
                        className="size-full border-0"
                      />
                    </motion.div>
                  ) : (
                    <motion.div key="poster" className="absolute inset-0">
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={600}
                        height={900}
                        unoptimized
                        className="size-full object-cover opacity-45"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
                      <div className="absolute inset-0 grid place-items-center">
                        <button
                          type="button"
                          onClick={() => setStarted(true)}
                          className="group relative grid size-24 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-all duration-500 hover:scale-110 hover:border-gold hover:bg-gold/20"
                          aria-label="Tangira kureba"
                        >
                          <span className="pulse-ring absolute inset-0 rounded-full bg-gold/30" />
                          <span className="pulse-ring pulse-ring-delay absolute inset-0 rounded-full bg-gold/20" />
                          <Play className="relative size-9 translate-x-1 fill-gold text-gold" />
                        </button>
                      </div>
                      <p className="absolute bottom-5 left-0 w-full text-center text-xs font-semibold tracking-wider text-white/50 uppercase">
                        Kanda kugira utangire kureba
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between gap-3 px-6 py-4 text-xs text-white/45">
                <span>{movie.creator}</span>
                <form action={reportBrokenAction}>
                  <input type="hidden" name="slug" value={movie.slug} />
                  <button type="submit" className="text-white/35 underline-offset-4 hover:text-rose-300 hover:underline">
                    Link yatamye? Tubimenyeshe
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
