import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, ExternalLink, Film, Play, Sparkles, Star, UserRound } from "lucide-react";
import MovieCard from "@/components/movie-card";
import PlayerButton from "@/components/player-button";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { getGenres, getMovieBySlug, getPublicMovies } from "@/lib/data";
import { toMovieView, toMovieViews } from "@/lib/view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/movies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
  if (!movie) return { title: "Filime ntiboneka" };
  return {
    title: movie.title,
    description: movie.synopsis,
    openGraph: {
      title: `${movie.title} | ireberefilm`,
      description: movie.synopsis,
      images: [movie.image],
    },
  };
}

export default async function MoviePage({ params }: PageProps<"/movies/[slug]">) {
  const { slug } = await params;
  const [movie, allMovies, genres] = await Promise.all([
    getMovieBySlug(slug),
    getPublicMovies(),
    getGenres(),
  ]);
  if (!movie) notFound();

  const colors = Object.fromEntries(genres.map((genre) => [genre.name, genre.color]));
  const view = toMovieView(movie, colors[movie.genre]);
  const related = [
    ...allMovies.filter((item) => item.slug !== movie.slug && item.genre === movie.genre),
    ...allMovies.filter((item) => item.slug !== movie.slug && item.genre !== movie.genre),
  ].slice(0, 5);
  const relatedViews = toMovieViews(related, colors);

  return (
    <main className="relative overflow-hidden pt-[76px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[880px]">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(60% 60% at 72% 18%, ${view.accent}30 0%, transparent 70%), radial-gradient(45% 45% at 15% 55%, ${view.glow}22 0%, transparent 70%)`,
          }}
        />
        <div className="grid-lines absolute inset-0" />
      </div>

      <section className="relative mx-auto max-w-7xl px-5 pt-12 pb-20 sm:px-8 sm:pt-20">
        <Reveal>
          <Link
            href="/browse"
            className="group inline-flex items-center gap-2 text-xs font-bold text-white/45 transition-colors hover:text-gold"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Garuka kuri filime zose
          </Link>
        </Reveal>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-[2/3]">
              <div className="absolute inset-4 rounded-full border border-dashed border-gold/25 spin-slow" />
              <div
                className="absolute inset-2 rounded-[32px] blur-3xl"
                style={{ background: `linear-gradient(135deg, ${view.accent}55, ${view.glow}40)` }}
              />
              <div className="shine absolute inset-0 overflow-hidden rounded-[26px] border border-white/20 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)]">
                <Image
                  src={view.poster}
                  alt={view.title}
                  width={600}
                  height={900}
                  unoptimized
                  priority
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </div>
              <div className="glass float-slow absolute -right-5 top-10 flex items-center gap-2 rounded-xl px-3 py-2.5 shadow-xl">
                <Star className="size-4 fill-gold text-gold" />
                <span className="font-display text-sm font-extrabold">{view.rating}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex items-center gap-3">
              <Sparkles className="size-4 text-gold" />
              <p className="text-[11px] font-bold tracking-[0.24em] text-gold uppercase">
                Agasobanuye · {view.genre}
              </p>
            </div>

            <h1 className="font-display mt-6 text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-7xl">
              {view.title}
            </h1>
            <p className="mt-3 text-lg text-white/35">({view.originalTitle})</p>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/55">
              <span className="glass-soft flex items-center gap-2 rounded-full px-4 py-2">
                <Star className="size-3.5 fill-gold text-gold" /> {view.rating} / 10
              </span>
              <span className="glass-soft flex items-center gap-2 rounded-full px-4 py-2">
                <Clock className="size-3.5 text-gold" /> {view.duration}
              </span>
              <span className="glass-soft flex items-center gap-2 rounded-full px-4 py-2">
                <Film className="size-3.5 text-gold" /> {view.year}
              </span>
            </div>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              {view.synopsis}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <PlayerButton movie={view} />
              <a
                href={view.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-white/70 transition-all hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
              >
                Inkomoko: {view.source}
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="glass-soft mt-9 flex max-w-xl items-center gap-4 rounded-2xl px-5 py-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                <UserRound className="size-5" />
              </span>
              <div>
                <p className="text-[10px] font-bold tracking-[0.18em] text-white/35 uppercase">
                  Agasobanuye na
                </p>
                <p className="font-display mt-1 text-sm font-bold text-white">
                  {view.creator.replace("Agasobanuye na ", "")}
                </p>
              </div>
              <span className="ml-auto hidden size-2 rounded-full bg-mint shadow-[0_0_12px_2px_rgba(48,227,176,0.6)] sm:block" />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="byinshi" className="relative border-y border-white/[0.06] bg-ink-2/60 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="Byinshi kuri iyi filime" title="Ibyo wamenya" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Izina ry'umwimerere", value: view.originalTitle, icon: Film },
              { label: "Icyiciro", value: view.genre, icon: Sparkles },
              { label: "Umwaka", value: String(view.year), icon: Play },
              { label: "Uko iboneka", value: view.playback === "embed" ? "Kureba hano" : "Gukurikirana inkomoko", icon: ExternalLink },
            ].map((item, index) => (
              <Reveal key={item.label} delay={index * 0.07}>
                <div className="glass-soft h-full rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-gold/30">
                  <item.icon className="size-5 text-gold" />
                  <p className="mt-5 text-[10px] font-bold tracking-[0.18em] text-white/35 uppercase">{item.label}</p>
                  <p className="font-display mt-2 text-base font-bold text-white">{item.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-3xl text-sm leading-7 text-white/40">
              Iyi filime iboneka kubera ubufatanye n&apos;abayikora. Tuzihesha icyubahiro
              umusobanuzi n&apos;urubuga rw&apos;umwimerere. Niba uri nyir&apos;uburenganzira
              ukaba ushaka gukuraho iyi filime,{" "}
              <Link href="/about#icyubahiro" className="text-gold hover:underline">
                usome uburyo hano
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="Nk'iyi" title="Zindi filime" href="/browse" linkLabel="Zose reba" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
            {relatedViews.map((item, index) => (
              <MovieCard key={item.slug} movie={item} index={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
