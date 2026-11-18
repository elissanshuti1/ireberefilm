import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CircleSlash,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";
import { checkLinkAction, deleteMovieAction, toggleMovieAction } from "@/lib/actions";
import { getAllMovies, getGenres } from "@/lib/data";
import { posterSrc } from "@/lib/poster";
import ConfirmSubmit from "@/components/admin/confirm-submit";

export const dynamic = "force-dynamic";

export default async function AdminMoviesPage({ searchParams }: PageProps<"/admin/movies">) {
  const params = await searchParams;
  const rawQuery = params.q;
  const query = Array.isArray(rawQuery) ? (rawQuery[0] ?? "") : (rawQuery ?? "");
  const allMovies = await getAllMovies();
  const genres = await getGenres();
  const q = query.toLowerCase().trim();
  const movies = q
    ? allMovies.filter((movie) =>
        [movie.title, movie.originalTitle, movie.creator, movie.genre].some((value) =>
          value.toLowerCase().includes(q),
        ),
      )
    : allMovies;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Filime</p>
          <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Kuyobora Filime</h1>
          <p className="mt-2 text-sm text-white/45">
            {allMovies.length} mu bubiko · {allMovies.filter((movie) => movie.published).length} ziri kuri site
          </p>
        </div>
        <Link
          href="/admin/movies/new"
          className="rounded-xl bg-gold px-5 py-3 text-sm font-extrabold text-ink transition-colors hover:bg-amber-300"
        >
          + Ongeza filime
        </Link>
      </div>

      {params.saved && (
        <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          Filime yabikiwe neza.
        </p>
      )}

      <form action="/admin/movies" method="get" className="flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={query}
          placeholder="Shakisha filime..."
          className="min-w-60 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-gold/60"
        />
        <button className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white/60 hover:text-gold">
          Shakisha
        </button>
        {q && (
          <Link href="/admin/movies" className="rounded-xl px-4 py-3 text-sm font-bold text-white/40">
            Sura byose
          </Link>
        )}
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-white/10 text-xs tracking-wider text-white/35 uppercase">
            <tr>
              <th className="px-5 py-4">Filime</th>
              <th className="px-4 py-4">Icyiciro</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Link</th>
              <th className="px-5 py-4 text-right">Ibikorwa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {movies.map((movie) => (
              <tr key={movie.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={posterSrc(movie)}
                      alt=""
                      width={40}
                      height={60}
                      unoptimized
                      className="size-10 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-bold">{movie.title}</p>
                      <p className="text-xs text-white/35">
                        {movie.originalTitle} · {movie.year}
                      </p>
                      {movie.isSeason && (
                        <p className="mt-1 text-[10px] font-bold text-gold">
                          Season · {movie.episodes.length} ibice
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-white/55">
                  {genres.find((genre) => genre.name === movie.genre)?.name ?? movie.genre}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        movie.published
                          ? "bg-emerald-400/15 text-emerald-300"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {movie.published ? "Iriho" : "Yihishe"}
                    </span>
                    {movie.featured && (
                      <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold text-gold">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`text-xs font-bold ${
                      movie.linkStatus === "ok"
                        ? "text-emerald-300"
                        : movie.linkStatus === "broken"
                          ? "text-rose-300"
                          : "text-white/40"
                    }`}
                  >
                    {movie.linkStatus === "ok" ? (
                      <span className="flex items-center gap-1"><Check className="size-3" /> OK</span>
                    ) : movie.linkStatus === "broken" ? (
                      <span className="flex items-center gap-1"><CircleSlash className="size-3" /> Yatamye</span>
                    ) : (
                      "Ntibyasuzumwe"
                    )}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/movies/${movie.slug}`}
                      title="Reba"
                      className="grid size-8 place-items-center rounded-lg text-white/40 hover:text-sky-300"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                    <Link
                      href={`/admin/movies/${movie.id}`}
                      title="Hindura"
                      className="grid size-8 place-items-center rounded-lg text-white/40 hover:text-gold"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <form action={toggleMovieAction}>
                      <input type="hidden" name="id" value={movie.id} />
                      <input type="hidden" name="key" value="published" />
                      <button
                        type="submit"
                        title={movie.published ? "Hisha" : "Garagaza"}
                        className="grid size-8 place-items-center rounded-lg text-white/40 hover:text-emerald-300"
                      >
                        {movie.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </form>
                    <form action={toggleMovieAction}>
                      <input type="hidden" name="id" value={movie.id} />
                      <input type="hidden" name="key" value="featured" />
                      <button
                        type="submit"
                        title="Featured"
                        className={`grid size-8 place-items-center rounded-lg hover:text-gold ${
                          movie.featured ? "text-gold" : "text-white/40"
                        }`}
                      >
                        <Star className="size-4" />
                      </button>
                    </form>
                    <form action={checkLinkAction}>
                      <input type="hidden" name="id" value={movie.id} />
                      <button
                        type="submit"
                        title="Suzuma link"
                        className="grid size-8 place-items-center rounded-lg text-white/40 hover:text-sky-300"
                      >
                        <RefreshCw className="size-4" />
                      </button>
                    </form>
                    <form action={deleteMovieAction}>
                      <input type="hidden" name="id" value={movie.id} />
                      <ConfirmSubmit
                        message={`Ushaka gusiba ${movie.title}?`}
                        title="Siba"
                        className="grid size-8 place-items-center rounded-lg text-white/40 hover:text-rose-300"
                      >
                        <Trash2 className="size-4" />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {movies.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-white/35">Nta filime iboneka.</p>
        )}
      </div>
    </div>
  );
}
