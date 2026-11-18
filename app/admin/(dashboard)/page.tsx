import Link from "next/link";
import { ArrowRight, CheckCircle2, Film, Star, Tags, TriangleAlert } from "lucide-react";
import { getDashboardStats, getAllMovies } from "@/lib/data";

export const dynamic = "force-dynamic";

const cards = [
  { label: "Filime zose", icon: Film, color: "from-gold to-orange-600" },
  { label: "Ziri kuri site", icon: CheckCircle2, color: "from-emerald-400 to-teal-600" },
  { label: "Ziragaragazwa", icon: Star, color: "from-sky-400 to-blue-600" },
  { label: "Ibyiciro", icon: Tags, color: "from-fuchsia-400 to-purple-600" },
];

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;
  const stats = await getDashboardStats();
  const movies = await getAllMovies();
  const values = [stats.total, stats.published, stats.featured, stats.genres];
  const attention = movies.filter(
    (movie) => movie.linkStatus === "broken" || movie.brokenReports > 0,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Incio</p>
          <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Murakaza neza, Elissa</h1>
          <p className="mt-2 text-sm text-white/45">Hano ureba uko urubuga rwose rumeze.</p>
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
          Byabikiwe neza.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20"
          >
            <span className={`grid size-10 place-items-center rounded-xl bg-gradient-to-br ${card.color} text-ink`}>
              <card.icon className="size-5" />
            </span>
            <p className="mt-5 font-display text-3xl font-black">{values[index]}</p>
            <p className="mt-1 text-sm text-white/40">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold">Ibikeneye kwitabwaho</h2>
          <TriangleAlert className="size-5 text-amber-300" />
        </div>
        {attention.length === 0 ? (
          <p className="mt-4 text-sm text-white/40">Nta link yatamye iboneka. Byose byiza.</p>
        ) : (
          <div className="mt-5 divide-y divide-white/5">
            {attention.slice(0, 6).map((movie) => (
              <div key={movie.id} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-bold">{movie.title}</p>
                  <p className="text-xs text-white/35">
                    {movie.brokenReports} raporo · {movie.linkStatus}
                  </p>
                </div>
                <Link
                  href={`/admin/movies/${movie.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-gold hover:underline"
                >
                  Gukosora <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
