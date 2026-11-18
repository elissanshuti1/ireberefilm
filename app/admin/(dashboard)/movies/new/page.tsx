import MovieForm from "@/components/admin/movie-form";
import { getGenres } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewMoviePage() {
  const genres = await getGenres();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Filime nshya</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Ongera filime</h1>
        <p className="mt-2 text-sm text-white/45">Uzuza amakuru yose hanyuma uyibike.</p>
      </div>
      <MovieForm genres={genres} />
    </div>
  );
}
