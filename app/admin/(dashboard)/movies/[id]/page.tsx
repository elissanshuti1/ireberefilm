import { notFound } from "next/navigation";
import MovieForm from "@/components/admin/movie-form";
import { getCommentsBySlug, getGenres, getMovieById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) notFound();
  const [genres, comments] = await Promise.all([
    getGenres(),
    getCommentsBySlug(movie.slug),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Hindura</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">{movie.title}</h1>
        <p className="mt-2 text-sm text-white/45">Hindura amakuru, ifoto cyangwa uko ikurikirwa.</p>
      </div>
      <MovieForm
        movie={movie}
        genres={genres}
        comments={comments}
        adminName={process.env.ADMIN_USERNAME ?? "Admin"}
      />
    </div>
  );
}
