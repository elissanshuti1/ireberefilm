import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, ExternalLink, Film, Layers, Play, Sparkles, Star, UserRound } from "lucide-react";
import CommentSection from "@/components/comment-section";
import JsonLd from "@/components/json-ld";
import MovieCard from "@/components/movie-card";
import PlayerButton from "@/components/player-button";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { getCommentsBySlug, getGenres, getMovieBySlug, getPublicMovies } from "@/lib/data";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import { toMovieView, toMovieViews } from "@/lib/view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/movies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
  if (!movie) return { title: "Filime ntiboneka", robots: { index: false, follow: false } };

  const canonical = `/movies/${encodeURIComponent(movie.slug)}`;
  const description =
    movie.synopsis ||
    `${movie.title} — agasobanuye mu Kinyarwanda urebe ku ireberefilm.`;
  const title = `${movie.title} — Agasobanuye mu Kinyarwanda`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "video.movie",
      locale: "rw_RW",
      siteName: "ireberefilm",
      url: canonical,
      images: [movie.image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [movie.image],
    },
  };
}

function partLetter(number: number) {
  return String.fromCharCode(65 + ((Math.max(number, 1) - 1) % 26));
}

export default async function MoviePage({ params }: PageProps<"/movies/[slug]">) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
  if (!movie) notFound();
  const [allMovies, genres, comments] = await Promise.all([
    getPublicMovies(),
    getGenres(),
    getCommentsBySlug(movie.slug),
  ]);

  const colors = Object.fromEntries(genres.map((genre) => [genre.name, genre.color]));
  const view = toMovieView(movie, colors[movie.genre]);
  const isMultiPart = view.isSeason || view.hasParts;
  const canEmbed = !isMultiPart && view.playback === "embed" && Boolean(view.embedUrl);
  const canWatchOutside = !isMultiPart && Boolean(view.sourceUrl) && view.sourceUrl !== "#";
  const watchData = {
    slug: view.slug,
    title: view.title,
    poster: view.poster,
    creator: view.creator,
    embedUrl: view.embedUrl,
  };
  const related = [
    ...allMovies.filter((item) => item.slug !== movie.slug && item.genre === movie.genre),
    ...allMovies.filter((item) => item.slug !== movie.slug && item.genre !== movie.genre),
  ].slice(0, 5);
  const relatedViews = toMovieViews(related, colors);
  const siteUrl = getSiteUrl();
  const movieUrl = absoluteUrl(`/movies/${encodeURIComponent(movie.slug)}`);
  const movieSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Movie",
        name: movie.title,
        alternateName: movie.originalTitle,
        description: movie.synopsis,
        url: movieUrl,
        image: absoluteUrl(view.poster),
        genre: movie.genre,
        inLanguage: "rw",
        ...(movie.year > 0 ? { datePublished: String(movie.year) } : {}),
        ...(movie.duration && movie.duration !== "—" ? { duration: movie.duration } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ireberefilm", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Filime zose", item: absoluteUrl("/browse") },
          { "@type": "ListItem", position: 3, name: movie.title, item: movieUrl },
        ],
      },
    ],
  };

  return (
    <main className="relative overflow-hidden pt-[76px]">
      <JsonLd data={movieSchema} />
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
              {isMultiPart && (
                <span className="glass-soft flex items-center gap-2 rounded-full px-4 py-2 text-gold">
                  <Layers className="size-3.5" />
                  {view.isSeason ? "Season" : "Ibice"} · {view.episodes.length}{" "}
                  {view.episodes.length === 1 ? "gice" : "ibice"}
                </span>
              )}
            </div>

            <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              {view.synopsis}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {isMultiPart ? (
                <a
                  href="#ibice"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-8 py-4 text-sm font-extrabold text-ink shadow-[0_20px_60px_-22px_rgba(247,183,51,0.95)] transition-transform duration-300 hover:scale-[1.04]"
                >
                  <span className="pulse-ring absolute inset-0 rounded-full bg-white/30" />
                  <span className="relative grid size-9 place-items-center rounded-full bg-ink/10 transition-transform duration-300 group-hover:scale-110">
                    <Layers className="size-4" />
                  </span>
                  <span className="relative">Reba ibice</span>
                  <ArrowUpRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : canEmbed ? (
                <PlayerButton movie={watchData} />
              ) : canWatchOutside ? (
                <a
                  href={view.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold px-8 py-4 text-sm font-extrabold text-ink shadow-[0_20px_60px_-22px_rgba(247,183,51,0.95)] transition-transform duration-300 hover:scale-[1.04]"
                >
                  <span className="pulse-ring absolute inset-0 rounded-full bg-white/30" />
                  <span className="relative grid size-9 place-items-center rounded-full bg-ink/10 transition-transform duration-300 group-hover:scale-110">
                    <ExternalLink className="size-4" />
                  </span>
                  <span className="relative">Kureba Hanze</span>
                  <ArrowUpRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : null}
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

      {isMultiPart && (
        <section id="ibice" className="relative border-y border-white/[0.06] bg-ink-2/60 py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <SectionHeading
              eyebrow={view.isSeason ? "Season" : "Ibice bya filime"}
              title="Ibigice byose"
              description={`${view.episodes.length} ${view.episodes.length === 1 ? "gice" : "ibice"} muri ${
                view.isSeason ? "iyi season" : "iyi filime"
              }.`}
            />
            {view.episodes.length === 0 ? (
              <Reveal>
                <p className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-8 text-sm text-white/40">
                  Nta gice kiriho ubu. Ubushe administrateur yongeramo ibice.
                </p>
              </Reveal>
            ) : (
              <div className="grid gap-3">
                {view.episodes.map((episode, index) => {
                  const episodeWatchData = {
                    slug: view.slug,
                    title: episode.title,
                    poster: view.poster,
                    creator: view.creator,
                    embedUrl: episode.embedUrl,
                  };
                  return (
                    <Reveal key={episode.id} delay={Math.min(index, 6) * 0.05}>
                      <div className="glass-soft flex flex-wrap items-center gap-4 rounded-2xl p-4 transition-colors hover:border-gold/30 sm:p-5">
                        <span className="font-display grid size-12 shrink-0 place-items-center rounded-xl bg-gold/10 text-lg font-extrabold text-gold">
                          {view.isSeason
                            ? String(episode.number).padStart(2, "0")
                            : partLetter(episode.number)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-base font-bold text-white sm:text-lg">
                            {episode.title}
                          </p>
                          <p className="mt-1 text-xs text-white/35">
                            {view.isSeason
                              ? `Igice cya ${episode.number}`
                              : `Igice ${partLetter(episode.number)}`}{" "}
                            · {view.title}
                          </p>
                        </div>
                        {episode.playback === "embed" && episode.embedUrl ? (
                          <PlayerButton
                            movie={episodeWatchData}
                            label="Kureba"
                            subtitle={episode.title}
                          />
                        ) : (
                          <a
                            href={episode.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/70 transition-all hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
                          >
                            Kureba Hanze
                            <ArrowUpRight className="size-4" />
                          </a>
                        )}
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <CommentSection slug={movie.slug} comments={comments} />

      <section id="byinshi" className="relative border-y border-white/[0.06] bg-ink-2/60 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading eyebrow="Byinshi kuri iyi filime" title="Ibyo wamenya" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Izina ry'umwimerere", value: view.originalTitle, icon: Film },
              { label: "Icyiciro", value: view.genre, icon: Sparkles },
              { label: "Umwaka", value: String(view.year), icon: Play },
              {
                label: "Uko iboneka",
                value: isMultiPart
                  ? `${view.isSeason ? "Season" : "Ibice"} · ${view.episodes.length}`
                  : canEmbed
                    ? "Kureba hano"
                    : "Kuranga hanze",
                icon: isMultiPart ? Layers : Play,
              },
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
              Iyi filime iboneka kugira ngo abakunda agasobanuye bayirebe byoroshye.
              Tuzihesha icyubahiro umusobanuzi. Niba uri nyir&apos;uburenganzira
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
