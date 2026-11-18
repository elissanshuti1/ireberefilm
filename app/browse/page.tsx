import type { Metadata } from "next";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import BrowseSearch from "@/components/browse-search";
import GenreFilter from "@/components/genre-filter";
import MovieCard from "@/components/movie-card";
import Reveal from "@/components/reveal";
import { filterPublicMovies, getGenres, getSettings } from "@/lib/data";
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
  const query = typeof params.q === "string" ? params.q : "";
  const [genres, settings] = await Promise.all([getGenres(), getSettings()]);
  const genreNames = ["Zose", ...genres.map((genre) => genre.name)];
  const requestedGenre = typeof params.genre === "string" ? params.genre : "Zose";
  const genre = genreNames.includes(requestedGenre) ? requestedGenre : "Zose";
  const results = await filterPublicMovies(query, genre);
  const colors = Object.fromEntries(genres.map((item) => [item.name, item.color]));
  const movies = toMovieViews(results, colors);

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

        <div className="mt-8 flex items-center justify-between text-sm text-white/40">
          <p>
            <span className="font-bold text-white">{results.length}</span> filime ziboneka
          </p>
          {(query || genre !== "Zose") && (
            <p className="text-gold">
              {genre !== "Zose" ? genre : ""}
              {genre !== "Zose" && query ? " · " : ""}
              {query ? `“${query}”` : ""}
            </p>
          )}
        </div>

        {movies.length > 0 ? (
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie, index) => (
              <MovieCard key={movie.slug} movie={movie} index={index} />
            ))}
          </div>
        ) : (
          <Reveal className="mt-10">
            <div className="glass-soft flex flex-col items-center rounded-3xl px-6 py-20 text-center">
              <span className="grid size-20 place-items-center rounded-3xl bg-gold/10 text-gold">
                <Search className="size-8" />
              </span>
              <h2 className="font-display mt-6 text-2xl font-extrabold">Nta filime yaboneka</h2>
              <p className="mt-3 max-w-sm text-sm leading-7 text-white/45">
                Gerageza izindi jambo, cyangwa hitamo icyiciro gitandukanye.
              </p>
            </div>
          </Reveal>
        )}
      </section>
    </main>
  );
}
