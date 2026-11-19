import type { Metadata } from "next";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import BrowseFilters from "@/components/browse-filters";
import BrowseResults from "@/components/browse-results";
import BrowseSearch from "@/components/browse-search";
import GenreFilter from "@/components/genre-filter";
import Reveal from "@/components/reveal";
import { filterPublicMovies, getGenres, getPublicMovies, getSettings } from "@/lib/data";
import { toMovieViews } from "@/lib/view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Filime zose",
  description: "Shakisha filime z'Agasobanuye mu Kinyarwanda ku rubuga rwa ireberefilm.",
  alternates: { canonical: "/browse" },
  openGraph: { url: "/browse" },
};

export default async function BrowsePage({ searchParams }: PageProps<"/browse">) {
  const params = await searchParams;
  const value = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");
  const query = value("q");
  const [genres, settings, allMovies] = await Promise.all([
    getGenres(),
    getSettings(),
    getPublicMovies(),
  ]);
  const genreNames = ["Zose", ...genres.map((genre) => genre.name)];
  const requestedGenre = value("genre") || "Zose";
  const genre = genreNames.includes(requestedGenre) ? requestedGenre : "Zose";
  const kind = value("kind") || "all";
  const year = value("year") || "all";
  const creator = value("creator") || "all";
  const sort = value("sort") || "latest";
  const watchlistOnly = value("watchlist") === "1";
  const results = await filterPublicMovies(query, genre, { kind, year, creator, sort });
  const colors = Object.fromEntries(genres.map((item) => [item.name, item.color]));
  const movies = toMovieViews(results, colors);
  const years = Array.from(new Set(allMovies.map((movie) => movie.year).filter(Boolean))).sort(
    (a, b) => b - a,
  );
  const creators = Array.from(new Set(allMovies.map((movie) => movie.creator).filter(Boolean))).sort();

  return (
    <main className="relative min-h-screen overflow-hidden pt-[76px]">
      <div className="aurora aurora-fade pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
      <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
      <div className="pointer-events-none absolute -top-40 right-1/4 size-96 rounded-full bg-violet/20 orb" />

      <section className="relative mx-auto max-w-7xl px-5 pt-16 pb-12 sm:px-8 sm:pt-24">
        <Reveal>
          <div className="flex items-center gap-3">
            <Sparkles className="size-4 text-gold" />
            <p className="text-[11px] font-bold tracking-[0.24em] text-gold uppercase">Ububiko bwa filime</p>
          </div>
          <h1 className="font-display mt-5 text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-7xl">
            Filime <span className="text-gradient">zose.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/50">
            Hitamo icyiciro, ushakishe izina cyangwa umusobanuzi, hanyuma urebe.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <BrowseSearch
            initialQuery={query}
            genre={genre}
            placeholder={settings.searchPlaceholder ?? "Shakisha filime, izina, cyangwa umusobanuzi..."}
          />
        </Reveal>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-28 sm:px-8">
        <Reveal delay={0.16} className="mb-8 flex items-center gap-3 border-y border-white/[0.06] py-6">
          <SlidersHorizontal className="size-4 text-white/40" />
          <span className="text-xs font-bold tracking-widest text-white/40 uppercase">{settings.categoriesTitle}</span>
        </Reveal>
        <Reveal delay={0.2}>
          <GenreFilter genres={genreNames} active={genre} query={query} />
        </Reveal>

        <BrowseFilters
          years={years}
          creators={creators}
          kind={kind}
          year={year}
          creator={creator}
          sort={sort}
          watchlistOnly={watchlistOnly}
        />

        <BrowseResults movies={movies} watchlistOnly={watchlistOnly} />
      </section>
    </main>
  );
}
