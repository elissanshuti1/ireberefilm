"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ImagePlus, Save } from "lucide-react";
import { saveMovieAction } from "@/lib/actions";
import { emptyActionState } from "@/lib/action-state";
import { posterSrc } from "@/lib/poster";
import type { GenreRecord, MovieRecord } from "@/lib/types";

type Props = { movie?: MovieRecord; genres: GenreRecord[] };

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-gold/60";

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">
      {children}
      {hint && <span className="ml-2 normal-case tracking-normal text-white/25">{hint}</span>}
    </span>
  );
}

export default function MovieForm({ movie, genres }: Props) {
  const [state, formAction, pending] = useActionState(saveMovieAction, emptyActionState);
  const [playback, setPlayback] = useState<"embed" | "link">(movie?.playback ?? "link");
  const [preview, setPreview] = useState(movie ? posterSrc(movie) : null);

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {movie && <input type="hidden" name="id" value={movie.id} />}

      {state.message && (
        <p className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.message}
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-lg font-extrabold">Ibisobanuro bya filime</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2">
            <Label>Izina rya filime</Label>
            <input name="title" required defaultValue={movie?.title} className={inputClass} placeholder="Urugero: The Bucket List" />
          </label>
          <label>
            <Label hint="Ibyiza kuba http://...">Slug</Label>
            <input name="slug" defaultValue={movie?.slug} className={inputClass} placeholder="Bizikora automatically" />
          </label>
          <label>
            <Label>Izina ry&apos;umwimerere</Label>
            <input name="originalTitle" defaultValue={movie?.originalTitle} className={inputClass} />
          </label>
          <label className="md:col-span-2">
            <Label>Incamake</Label>
            <textarea
              name="synopsis"
              rows={4}
              defaultValue={movie?.synopsis}
              className={`${inputClass} resize-none`}
              placeholder="Andika incamake mu Kinyarwanda..."
            />
          </label>
          <label>
            <Label>Icyiciro</Label>
            <select name="genre" defaultValue={movie?.genre ?? genres[0]?.name} className={inputClass}>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.name} className="bg-ink-2">
                  {genre.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <Label>Umwaka</Label>
            <input name="year" type="number" defaultValue={movie?.year ?? 2026} className={inputClass} />
          </label>
          <label>
            <Label>Igihe</Label>
            <input name="duration" defaultValue={movie?.duration} className={inputClass} placeholder="1h 56min" />
          </label>
          <label>
            <Label>Imyanya / Rating</Label>
            <input name="rating" defaultValue={movie?.rating} className={inputClass} placeholder="8.1/10" />
          </label>
          <label className="md:col-span-2">
            <Label>Umusobanuzi / Uwatwaye ijwi</Label>
            <input name="creator" defaultValue={movie?.creator} className={inputClass} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-lg font-extrabold">Ifoto ya filime</h2>
        <div className="mt-5 flex items-start gap-6">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
            {preview ? (
              <Image src={preview} alt="Poster preview" fill unoptimized sizes="112px" className="object-cover" />
            ) : (
              <span className="grid size-full place-items-center text-white/25"><ImagePlus className="size-6" /></span>
            )}
          </div>
          <label className="flex-1">
            <Label hint="PNG, JPG, WEBP, SVG · max 4MB">Hitamo image nshya</Label>
            <input
              name="poster"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
              className="w-full text-xs text-white/50 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-white/20"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-lg font-extrabold">Uko ikurikirwa</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label>
            <Label>Uburyo</Label>
            <select
              name="playback"
              value={playback}
              onChange={(event) => setPlayback(event.target.value as "embed" | "link")}
              className={inputClass}
            >
              <option value="link" className="bg-ink-2">Link isanzwe (link-out)</option>
              <option value="embed" className="bg-ink-2">Embed (irebwa hano)</option>
            </select>
          </label>
          <label>
            <Label>Source</Label>
            <input name="source" defaultValue={movie?.source} className={inputClass} placeholder="Urugero: Oshakur Films" />
          </label>
          <label className="md:col-span-2">
            <Label>Source URL</Label>
            <input name="sourceUrl" defaultValue={movie?.sourceUrl} className={inputClass} placeholder="https://..." />
          </label>
          {playback === "embed" && (
            <label className="md:col-span-2">
              <Label hint="vsembed, youtube cyangwa oshakurfilms">Embed URL</Label>
              <input name="embedUrl" defaultValue={movie?.embedUrl ?? ""} className={inputClass} placeholder="https://vsembed.com/..." />
            </label>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 text-sm font-bold text-white/70">
            <input name="published" type="checkbox" defaultChecked={movie?.published ?? true} className="size-4 accent-[#f7b733]" />
            Garagaza kuri site
          </label>
          <label className="flex items-center gap-3 text-sm font-bold text-white/70">
            <input name="featured" type="checkbox" defaultChecked={movie?.featured ?? false} className="size-4 accent-[#f7b733]" />
            Shyira mu zigaragazwa (featured)
          </label>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/movies" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white/50 hover:text-white">
          Subira inyuma
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-extrabold text-ink hover:bg-amber-300 disabled:opacity-60"
        >
          <Save className="size-4" />
          {pending ? "Kubika..." : movie ? "Hindura" : "Ongeza filime"}
        </button>
      </div>
    </motion.form>
  );
}
