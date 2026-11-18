"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Layers, Play, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { MovieView } from "@/lib/types";

type HeroMovie = Pick<
  MovieView,
  | "slug"
  | "accent"
  | "glow"
  | "kicker"
  | "title"
  | "tagline"
  | "rating"
  | "year"
  | "duration"
  | "genre"
  | "poster"
  | "creator"
  | "isSeason"
> & { episodeCount: number };

const variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 80 : -80,
    filter: "blur(12px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -80 : 80,
    filter: "blur(12px)",
    transition: { duration: 0.4, ease: [0.4, 0, 1, 1] as const },
  }),
};

export default function HeroCarousel({
  movies,
  ctaLabel = "Kureba Nonaha",
  secondaryLabel = "Soma Byinshi",
}: {
  movies: HeroMovie[];
  ctaLabel?: string;
  secondaryLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const movie = movies[index];

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 90, damping: 18 });
  const springY = useSpring(pointerY, { stiffness: 90, damping: 18 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-11, 11]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % movies.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, movies.length]);

  if (!movies.length) return null;

  const go = (step: number) => {
    setDirection(step);
    setIndex((current) => (current + step + movies.length) % movies.length);
  };

  const handlePointer = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      className="noise relative isolate min-h-[100svh] overflow-hidden pt-[76px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        resetPointer();
      }}
    >
      <div className="absolute inset-0 -z-20 bg-ink" />
      <AnimatePresence mode="sync">
        <motion.div
          key={movie.slug}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 -z-10"
          style={{
            background: `radial-gradient(70% 70% at 70% 35%, ${movie.accent}2e 0%, transparent 68%), radial-gradient(50% 60% at 18% 78%, ${movie.glow}26 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>
      <div className="grid-lines absolute inset-0 -z-10" />
      <div
        className="orb absolute -top-32 right-[12%] size-[420px] rounded-full opacity-30"
        style={{ background: movie.accent }}
      />
      <div
        className="orb orb-slow absolute -bottom-48 left-[-10%] size-[460px] rounded-full opacity-20"
        style={{ background: movie.glow }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-10 pb-32 sm:px-8 lg:min-h-[calc(100svh-76px)] lg:grid-cols-[1.02fr_0.98fr] lg:gap-4 lg:pt-0 lg:pb-24">
        <div className="relative z-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={movie.slug}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mb-7 inline-flex items-center gap-3 rounded-full border border-gold/25 bg-gold/10 px-4 py-2"
              >
                <Sparkles className="size-3.5 text-gold" />
                <span className="text-[11px] font-bold tracking-[0.22em] text-gold uppercase">
                  {movie.kicker ?? "Agasobanuye"}
                </span>
                {movie.isSeason && (
                  <>
                    <span className="size-1.5 animate-pulse rounded-full bg-gold" />
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gold uppercase">
                      <Layers className="size-3.5" />
                      Season · {movie.episodeCount} {movie.episodeCount === 1 ? "gice" : "ibice"}
                    </span>
                  </>
                )}
              </motion.div>

              <h1 className="font-display text-[clamp(3.2rem,8vw,6.6rem)] leading-[0.94] font-extrabold tracking-[-0.045em]">
                {movie.title.split(" ").map((word, wordIndex) => (
                  <span key={`${word}-${wordIndex}`} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                    <motion.span
                      className={wordIndex % 2 === 1 ? "text-gradient inline-block" : "inline-block text-white"}
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.12 + wordIndex * 0.08,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.7 }}
                className="mt-7 max-w-lg text-base leading-8 text-white/60 sm:text-lg"
              >
                {movie.tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.7 }}
                className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-white/60"
              >
                <span className="flex items-center gap-1.5 font-bold text-gold">
                  <Star className="size-4 fill-gold text-gold" />
                  {movie.rating}
                </span>
                <span className="size-1 rounded-full bg-white/25" />
                <span>{movie.year}</span>
                <span className="size-1 rounded-full bg-white/25" />
                <span>{movie.duration}</span>
                <span className="size-1 rounded-full bg-white/25" />
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                  {movie.genre}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.7 }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <Link
                  href={`/movies/${movie.slug}`}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-7 py-4 text-sm font-extrabold text-ink shadow-[0_20px_60px_-20px_rgba(247,183,51,0.9)] transition-transform duration-300 hover:scale-[1.03]"
                >
                  <span className="relative flex size-8 items-center justify-center rounded-full bg-ink/10 transition-transform duration-300 group-hover:scale-110">
                    <span className="pulse-ring absolute inset-0 rounded-full bg-ink/20" />
                    <Play className="relative size-4 translate-x-px fill-ink" />
                  </span>
                  {ctaLabel}
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
                <Link
                  href={`/movies/${movie.slug}#byinshi`}
                  className="glass-soft inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10"
                >
                  {secondaryLabel}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="relative z-10 mx-auto w-full max-w-[560px]"
          onMouseMove={handlePointer}
          onMouseLeave={resetPointer}
        >
          <motion.div
            style={
              reduceMotion
                ? undefined
                : { rotateX, rotateY, transformPerspective: 1200 }
            }
            className="relative h-[400px] sm:h-[520px] lg:h-[580px]"
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`left-${movie.slug}`}
                initial={{ opacity: 0, x: -60, y: 30, rotate: -20 }}
                animate={{ opacity: 0.75, x: -110, y: 20, rotate: -16 }}
                exit={{ opacity: 0, x: -180 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-14 left-2 hidden h-[390px] w-[230px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:block lg:left-0 lg:h-[430px] lg:w-[260px]"
              >
                <Image
                  src={movies[(index + 1) % movies.length].poster}
                  alt=""
                  width={600}
                  height={900}
                  unoptimized
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              </motion.div>

              <motion.div
                key={`right-${movie.slug}`}
                initial={{ opacity: 0, x: 60, y: 30, rotate: 18 }}
                animate={{ opacity: 0.7, x: 120, y: 36, rotate: 14 }}
                exit={{ opacity: 0, x: 180 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-24 right-0 hidden h-[380px] w-[230px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:block lg:h-[420px] lg:w-[260px]"
              >
                <Image
                  src={movies[(index + 2) % movies.length].poster}
                  alt=""
                  width={600}
                  height={900}
                  unoptimized
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              </motion.div>

              <motion.div
                key={`front-${movie.slug}`}
                initial={{ opacity: 0, y: 60, scale: 0.9, rotate: 8 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 3 }}
                exit={{ opacity: 0, y: -40, scale: 0.94 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                className="shine absolute top-0 left-1/2 h-[370px] w-[248px] -translate-x-1/2 overflow-hidden rounded-[26px] border border-white/20 shadow-[0_45px_90px_-30px_rgba(0,0,0,0.95)] sm:h-[460px] sm:w-[308px] lg:h-[500px] lg:w-[330px]"
              >
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={600}
                  height={900}
                  unoptimized
                  priority
                  className="size-full object-cover"
                />
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
                <div className="absolute top-5 left-5 rounded-full border border-white/30 bg-black/30 px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] uppercase backdrop-blur-md">
                  Agasobanuye
                </div>
                <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-6">
                  <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">{movie.genre}</p>
                  <p className="font-display mt-1 truncate text-2xl font-extrabold text-white sm:text-3xl">
                    {movie.title}
                  </p>
                  <Link
                    href={`/movies/${movie.slug}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-gold hover:text-ink"
                    aria-label={`Reba ${movie.title}`}
                  >
                    <Play className="size-3 fill-current" />
                    Reba nonaha
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute top-8 right-0 z-20 hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-xl sm:flex lg:-right-4"
            >
              <span className="grid size-9 place-items-center rounded-xl bg-gold/15 text-gold">
                <Star className="size-4 fill-gold" />
              </span>
              <div>
                <p className="text-[10px] tracking-widest text-white/40 uppercase">Urutonde</p>
                <p className="font-display text-sm font-bold">{movie.rating} / 10</p>
              </div>
            </motion.div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="glass absolute bottom-10 left-0 z-20 hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-xl sm:flex lg:-left-6"
            >
              <span className="relative grid size-9 place-items-center rounded-xl bg-mint/15 text-mint">
                <Play className="size-4 fill-mint" />
              </span>
              <div>
                <p className="text-[10px] tracking-widest text-white/40 uppercase">Uko ibona</p>
                <p className="font-display text-sm font-bold">Kureba gusa</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute right-0 bottom-8 left-0 z-20 mx-auto flex max-w-7xl items-center gap-5 px-5 sm:px-8">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            className="glass-soft grid size-11 place-items-center rounded-full text-white/70 transition-all hover:border-gold/50 hover:text-gold"
            aria-label="Filime ibanza"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="glass-soft grid size-11 place-items-center rounded-full text-white/70 transition-all hover:border-gold/50 hover:text-gold"
            aria-label="Filime ikurikira"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="flex flex-1 items-center gap-2 sm:gap-3">
          {movies.map((item, itemIndex) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => {
                setDirection(itemIndex > index ? 1 : -1);
                setIndex(itemIndex);
              }}
              className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/15"
              aria-label={`Jya kuri ${item.title}`}
            >
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-gold"
                animate={{ width: itemIndex === index ? "100%" : "0%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
              {itemIndex === index && !paused && !reduceMotion && (
                <motion.span
                  key={`timer-${index}`}
                  className="absolute inset-y-0 left-0 origin-left bg-gold/60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 7, ease: "linear" }}
                  style={{ width: "100%" }}
                />
              )}
            </button>
          ))}
        </div>

        <p className="font-display hidden text-sm font-bold text-white/40 sm:block">
          <span className="text-gold">0{index + 1}</span> / 0{movies.length}
        </p>
      </div>
    </section>
  );
}
