import Link from "next/link";
import { Eye, MousePointerClick, Pencil, Trash2, Users } from "lucide-react";
import ConfirmSubmit from "@/components/admin/confirm-submit";
import { deleteAdAction, toggleAdActiveAction } from "@/lib/actions";
import { isAdActive } from "@/lib/ads";
import { getAllAds } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  const ads = await getAllAds();

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Yamamajwe</p>
          <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Kuyobora Yamamajwe</h1>
          <p className="mt-2 text-sm text-white/45">
            {ads.length} muri sisitemu · {ads.filter((ad) => isAdActive(ad)).length} ziri gukoreshwa
          </p>
        </div>
        <Link
          href="/admin/ads/new"
          className="rounded-xl bg-gold px-5 py-3 text-sm font-extrabold text-ink transition-colors hover:bg-amber-300"
        >
          + Ongeza iyamamajwe
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <p className="font-display text-xl font-extrabold text-white">Nta yamamajwe iboneka</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/45">
            Iyo nta yamamajwe yongeweho, nta kimenyetso cyayo kigaragara kuri site.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {ads.map((ad) => {
            const active = isAdActive(ad);
            return (
              <div
                key={ad.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-xl font-extrabold text-white">{ad.title}</h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${
                          active
                            ? "bg-emerald-400/10 text-emerald-200"
                            : "bg-white/5 text-white/35"
                        }`}
                      >
                        {active ? "Active" : "Ntikoreshwa"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-gold">{ad.advertiser}</p>
                    <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-white/45">
                      {ad.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/ads/${ad.id}`}
                      title="Hindura"
                      className="grid size-10 place-items-center rounded-xl border border-white/10 text-white/50 transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <form action={toggleAdActiveAction}>
                      <input type="hidden" name="id" value={ad.id} />
                      <button
                        type="submit"
                        title={active ? "Hagarika" : "Koresha"}
                        className="grid size-10 place-items-center rounded-xl border border-white/10 text-white/50 transition-colors hover:border-gold/40 hover:text-gold"
                      >
                        {active ? "Hagarika" : "Koresha"}
                      </button>
                    </form>
                    <form action={deleteAdAction}>
                      <input type="hidden" name="id" value={ad.id} />
                      <ConfirmSubmit
                        message="Uzisanga usiba iyi yamamajwe?"
                        title="Siba"
                        className="grid size-10 place-items-center rounded-xl border border-white/10 text-white/50 transition-colors hover:border-red-400/40 hover:text-red-300"
                      >
                        <Trash2 className="size-4" />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/45">
                    Square ku ruhande rw&apos;iburyo
                  </span>
                  {ad.placements.includes("movie_popup") ? (
                    <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] text-gold">
                      Popup kuri movie
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap gap-5 text-xs text-white/40">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="size-3.5" /> {ad.views} views
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5" /> {ad.uniqueViews} unique
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MousePointerClick className="size-3.5" /> {ad.clicks} clicks
                  </span>
                  <span>{ad.durationSeconds}s</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
