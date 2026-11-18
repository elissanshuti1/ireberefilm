import { Trash2 } from "lucide-react";
import GenreForm from "@/components/admin/genre-form";
import ConfirmSubmit from "@/components/admin/confirm-submit";
import { deleteGenreAction } from "@/lib/actions";
import { getGenres } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminGenresPage({ searchParams }: PageProps<"/admin/genres">) {
  const params = await searchParams;
  const genres = await getGenres();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Ibyiciro</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Ibyiciro bya filime</h1>
        <p className="mt-2 text-sm text-white/45">
            Ibyiciro byose biri kuri site biva hano. Ushobora kongera, guhindura izina n&apos;ibara.
        </p>
      </div>

      {params.saved && (
        <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          Icyiciro cyabikiwe neza.
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-lg font-extrabold">Ongera icyiciro gishya</h2>
        <div className="mt-5">
          <GenreForm />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="font-display text-lg font-extrabold">Ibyiciro biriho ({genres.length})</h2>
        </div>
        <div className="divide-y divide-white/5">
          {genres.map((genre) => (
            <div key={genre.id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
              <span className="grid size-9 place-items-center rounded-lg text-xs font-black text-ink" style={{ background: genre.color }}>
                {genre.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{genre.name}</p>
                <p className="text-xs text-white/35">/{genre.slug} · urutonde {genre.order}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <GenreForm genre={genre} compact />
                <form action={deleteGenreAction}>
                  <input type="hidden" name="id" value={genre.id} />
                  <ConfirmSubmit
                    message={`Usiba icyiciro ${genre.name}?`}
                    title="Siba"
                    className="grid size-10 place-items-center rounded-xl border border-rose-500/20 text-rose-300 hover:bg-rose-500/10"
                  >
                    <Trash2 className="size-4" />
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
