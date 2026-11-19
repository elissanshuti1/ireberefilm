import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Eye,
  Film,
  MousePointerClick,
  Star,
  Tags,
  TriangleAlert,
  Users,
} from "lucide-react";
import { getAnalyticsSummary, getDashboardStats, getAllMovies } from "@/lib/data";
import type { AnalyticsEventRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

const cards = [
  { label: "Filime zose", icon: Film, color: "from-gold to-orange-600" },
  { label: "Ziri kuri site", icon: CheckCircle2, color: "from-emerald-400 to-teal-600" },
  { label: "Ziragaragazwa", icon: Star, color: "from-sky-400 to-blue-600" },
  { label: "Ibyiciro", icon: Tags, color: "from-fuchsia-400 to-purple-600" },
];

const activityLabels: Record<AnalyticsEventRecord["type"], string> = {
  page_view: "Gusura urubuga",
  movie_view: "Kureba filime",
  movie_click: "Gukanda kuri filime",
  playback_error: "Isano ntibyabaye",
};

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("rw-RW", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Kigali",
  }).format(date);
}

export default async function AdminHome({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;
  const stats = await getDashboardStats();
  const movies = await getAllMovies();
  const analytics = await getAnalyticsSummary();
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-extrabold">Ibarura ry&apos;abasuye urubuga</h2>
            <p className="mt-1 text-xs text-white/40">Bikurikiranwa n&apos;ID idasobanura uwabasuye, nta aderesi ya IP ibikwa.</p>
          </div>
          <Activity className="size-5 text-gold" />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Gusura kose", value: analytics.visits, note: `${analytics.todayVisits} uyu munsi`, icon: Activity },
            { label: "Abasuye batandukanye", value: analytics.uniqueVisitors, note: "Abakoresheje urubuga", icon: Users },
            { label: "Kureba filime", value: analytics.movieViews, note: "Igihe cyose", icon: Eye },
            { label: "Gukanda kuri filime", value: analytics.movieClicks, note: "Igihe cyose", icon: MousePointerClick },
            { label: "Kubura kw&apos;isano", value: analytics.playbackErrors, note: "Raporo z&apos;abareba", icon: TriangleAlert },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/10 bg-ink-3/50 p-4">
              <span className="grid size-9 place-items-center rounded-lg bg-gold/10 text-gold">
                <item.icon className="size-4" />
              </span>
              <p className="mt-4 font-display text-2xl font-black">{item.value}</p>
              <p className="mt-1 text-xs font-bold text-white/70">{item.label}</p>
              <p className="mt-0.5 text-[11px] text-white/35">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-display text-xl font-extrabold">Abasuye urubuga</h2>
          {analytics.visitors.length === 0 ? (
            <p className="mt-4 text-sm text-white/40">Nta basuye baboneka.</p>
          ) : (
            <div className="mt-5 divide-y divide-white/5">
              {analytics.visitors.map((visitor) => (
                <div key={visitor.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-bold text-gold">{visitor.id.slice(0, 8)}</p>
                    <p className="mt-1 truncate text-[11px] text-white/35">{visitor.lastPath}</p>
                  </div>
                  <div className="shrink-0 text-right text-[11px] text-white/50">
                    <p>{visitor.visits} gusura · {visitor.movieViews} kureba</p>
                    <p>{visitor.clicks} kanda · {formatWhen(visitor.lastSeen)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-display text-xl font-extrabold">Filime zirebwa cyane</h2>
          {analytics.movies.length === 0 ? (
            <p className="mt-4 text-sm text-white/40">Nta filime yarabonwa.</p>
          ) : (
            <div className="mt-5 divide-y divide-white/5">
              {analytics.movies.map((movie) => (
                <div key={movie.slug} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{movie.title}</p>
                    <p className="text-[11px] text-white/35">{movie.slug}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-[11px] text-white/50">
                    <span>{movie.views} kureba</span>
                    <span>{movie.clicks} kanda</span>
                    <Link
                      href={`/movies/${movie.slug}`}
                      className="text-gold hover:underline"
                      aria-label={`Reba ${movie.title}`}
                    >
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-xl font-extrabold">Ibikorwa bya vuba</h2>
        {analytics.activity.length === 0 ? (
          <p className="mt-4 text-sm text-white/40">Nta kureba filime cyangwa gukanda biraboneka.</p>
        ) : (
          <div className="mt-5 divide-y divide-white/5">
            {analytics.activity.map((event) => (
              <div key={event.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-gold/10 px-2 py-1 text-[10px] font-bold text-gold">
                    {activityLabels[event.type]}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{event.title || event.slug || event.path}</p>
                    <p className="font-mono text-[11px] text-white/35">{event.visitorId.slice(0, 8)}</p>
                  </div>
                </div>
                <p className="text-[11px] text-white/40">{formatWhen(event.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
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
