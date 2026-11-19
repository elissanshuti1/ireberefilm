import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play, Sparkles } from "lucide-react";
import ContinueWatching from "@/components/continue-watching";
import HeroCarousel from "@/components/hero-carousel";
import JsonLd from "@/components/json-ld";
import Marquee from "@/components/marquee";
import MovieCard from "@/components/movie-card";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import Stats from "@/components/stats";
import {
  getAllMovies,
  getFeaturedMovies,
  getGenres,
  getNewMovies,
  getPopularMovies,
  getPublicMovies,
  getSettings,
} from "@/lib/data";
import { absoluteUrl } from "@/lib/site";
import { toMovieViews } from "@/lib/view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const palette = ["#f7b733", "#f59e0b", "#0ea5e9", "#db2777", "#7c3aed", "#059669"];

export default async function Home() {
  const [featured, newMovies, popular, genres, settings, allMovies, publicMovies] =
    await Promise.all([
      getFeaturedMovies(),
      getNewMovies(8),
      getPopularMovies(6),
      getGenres(),
      getSettings(),
      getAllMovies(),
      getPublicMovies(),
    ]);

  const colors = Object.fromEntries(genres.map((genre) => [genre.name, genre.color]));
  const heroMovies = toMovieViews(featured.length ? featured : newMovies.slice(0, 6), colors).map(
    (movie) => ({
      slug: movie.slug,
      accent: movie.accent,
      glow: movie.glow,
      kicker: movie.kicker,
      title: movie.title,
      tagline: movie.tagline,
      rating: movie.rating,
      year: movie.year,
      duration: movie.duration,
      genre: movie.genre,
      poster: movie.poster,
      creator: movie.creator,
      isSeason: movie.isSeason,
      hasParts: movie.hasParts,
      episodeCount: movie.episodes.length,
    }),
  );
  const newViews = toMovieViews(newMovies, colors);
  const popularViews = toMovieViews(popular, colors);
  const seasonViews = toMovieViews(
    publicMovies.filter((movie) => movie.isSeason),
    colors,
  );
  const categoryTiles = genres.slice(0, 6).map((genre, index) => ({
    label: genre.name,
    count: String(allMovies.filter((movie) => movie.genre === genre.name).length).padStart(2, "0"),
    from: genre.color || palette[index % palette.length],
    to: palette[(index + 2) % palette.length],
  }));
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: settings.newTitle,
    itemListElement: heroMovies.map((movie, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: movie.title,
      url: absoluteUrl(`/movies/${encodeURIComponent(movie.slug)}`),
      image: absoluteUrl(movie.poster),
    })),
  };

  return (
    <main>
      <JsonLd data={listSchema} />
      <HeroCarousel movies={heroMovies} ctaLabel={settings.heroCta} secondaryLabel={settings.heroSecondary} />
      <Marquee />
      <Stats moviesCount={allMovies.length} genresCount={genres.length} />
      <ContinueWatching />

      <section id="filime-nshya" className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute top-10 left-1/4 size-80 rounded-full bg-violet/10 orb" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Zikiri gushya"
            title={settings.newTitle}
            description="Zimwe zikimara kuza, zindi ziraza vuba. Zose ziri mu Kinyarwanda."
            href="/browse"
            linkLabel="Zose reba"
          />
          <div className="mask-fade-x -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 sm:mx-0 sm:px-0">
            {newViews.map((movie, index) => (
              <div key={movie.slug} className="w-[58vw] shrink-0 snap-start sm:w-[38vw] lg:w-[23%]">
                <MovieCard movie={movie} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="zikunzwe" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Zatoranyijwe"
            title={settings.popularTitle}
            description="Filime zirebwa cyane, kandi zikaba zikiri nziza nyuma yo kureba kenshi."
            href="/browse"
            linkLabel="Reba zose"
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
            {popularViews.map((movie, index) => (
              <MovieCard key={movie.slug} movie={movie} index={index} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section id="season" className="relative overflow-hidden border-t border-white/[0.06] bg-ink-2/40 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Ibice bikurikiranye"
            title="Season"
            description="Season zose z'Agasobanuye, ibice byazo byose biri hano."
            href="/browse"
            linkLabel="Zose reba"
          />
          {seasonViews.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-white/40">
              Nta season iboneka ubu.
            </p>
          ) : (
            <div className="mask-fade-x -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 sm:mx-0 sm:px-0">
              {seasonViews.map((movie, index) => (
                <div key={movie.slug} className="w-[58vw] shrink-0 snap-start sm:w-[38vw] lg:w-[23%]">
                  <MovieCard movie={movie} index={index} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="ibyiciro" className="relative overflow-hidden border-t border-white/[0.06] bg-ink-2/60 py-24 sm:py-32">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Hitamo ubwo ukunda"
            title={settings.categoriesTitle}
            description="Kuva ku byishimo kugeza ku bwoba, buri munsi ufite filime yayo."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTiles.map((tile, index) => (
              <Reveal key={tile.label} delay={index * 0.06}>
                <Link
                  href={`/browse?genre=${encodeURIComponent(tile.label)}`}
                  className="group relative block h-40 overflow-hidden rounded-3xl border border-white/10 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-white/25"
                  style={{
                    background: `linear-gradient(135deg, ${tile.from}2b, ${tile.to}18), #0b0d16`,
                  }}
                >
                  <div
                    className="absolute -right-10 -bottom-16 size-52 rounded-full opacity-40 blur-3xl transition-all duration-700 group-hover:scale-125"
                    style={{ background: tile.from }}
                  />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <span
                        className="grid size-11 place-items-center rounded-2xl border border-white/20 bg-white/5 text-white transition-all duration-500 group-hover:rotate-6 group-hover:scale-110"
                        style={{ color: tile.from }}
                      >
                        <Play className="size-4 fill-current" />
                      </span>
                      <span className="font-display text-3xl font-extrabold text-white/10">{tile.count}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <h3 className="font-display text-2xl font-extrabold text-white">{tile.label}</h3>
                      <ArrowRight className="size-5 text-white/40 transition-all duration-500 group-hover:translate-x-2 group-hover:text-gold" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 grid-lines" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 orb" />
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <Reveal>
            <span className="glass-soft mx-auto grid size-16 place-items-center rounded-2xl text-gold">
              <Sparkles className="size-7" />
            </span>
            <h2 className="font-display mt-8 text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-6xl">
              Agasobanuye kose,
              <br />
              <span className="text-gradient">ahantu hamwe.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/50">
              Ireberefilm ikusanya filime z&apos;Abanyamerika, Abahinde n&apos;izindi za cinema
              y&apos;isi, zose zisobanurwa mu Kinyarwanda, hamwe n&apos;izina ry&apos;umusobanuzi.
            </p>
            <Link
              href="/browse"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-extrabold text-ink transition-all duration-300 hover:gap-5 hover:bg-gold"
            >
              Tangira ureba
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
            <p className="mt-5 text-xs text-white/30">
              {allMovies.length} filime · Zose mu Kinyarwanda · Zishyirwa hansi y&apos;ubuyobozi
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
