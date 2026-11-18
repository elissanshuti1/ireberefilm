"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ImagePlus, Layers, Plus, Save, Trash2 } from "lucide-react";
import AdminCommentsPanel from "@/components/admin/admin-comments-panel";
import { saveMovieAction } from "@/lib/actions";
import { emptyActionState } from "@/lib/action-state";
import { posterSrc } from "@/lib/poster";
import type { CommentRecord, EpisodeRecord, GenreRecord, MovieRecord } from "@/lib/types";

type Props = {
  movie?: MovieRecord;
  genres: GenreRecord[];
  comments?: CommentRecord[];
  adminName?: string;
};

type MovieKind = "movie" | "parts" | "season";

type EpisodeDraft = {
  id: string;
  number: number;
  title: string;
  link: string;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-gold/60";

function newEpisodeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `episode-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function partLetter(index: number) {
  return String.fromCharCode(65 + (index % 26));
}

function isVsembedLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const candidate = trimmed.startsWith("//")
    ? `https:${trimmed}`
    : /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
  try {
    const host = new URL(candidate).hostname.toLowerCase().replace(/^www\./, "");
    return host === "vsembed.com" || host.endsWith(".vsembed.com");
  } catch {
    return false;
  }
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">
      {children}
      {hint && <span className="ml-2 normal-case tracking-normal text-white/25">{hint}</span>}
    </span>
  );
}

export default function MovieForm({ movie, genres, comments = [], adminName = "Admin" }: Props) {
  const [state, formAction, pending] = useActionState(saveMovieAction, emptyActionState);
  const [playback, setPlayback] = useState<"embed" | "link">(movie?.playback ?? "embed");
  const [preview, setPreview] = useState(movie ? posterSrc(movie) : null);
  const [kind, setKind] = useState<MovieKind>(
    movie?.isSeason ? "season" : movie?.hasParts ? "parts" : "movie",
  );
  const isSeason = kind === "season";
  const isMultiPart = kind !== "movie";
  const [episodes, setEpisodes] = useState<EpisodeDraft[]>(() =>
    (movie?.episodes ?? []).map((episode: EpisodeRecord) => ({
      id: episode.id,
      number: episode.number,
      title: episode.title,
      link: episode.embedUrl || episode.sourceUrl || "",
    })),
  );

  const updateEpisode = (id: string, patch: Partial<EpisodeDraft>) => {
    setEpisodes((current) =>
      current.map((episode) => (episode.id === id ? { ...episode, ...patch } : episode)),
    );
  };

  const addEpisode = () => {
    setEpisodes((current) => [
      ...current,
      {
        id: newEpisodeId(),
        number: current.length + 1,
        title: kind === "parts" ? partLetter(current.length) : `Igice cya ${current.length + 1}`,
        link: "",
      },
    ]);
  };

  const removeEpisode = (id: string) => {
    setEpisodes((current) => current.filter((episode) => episode.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.form
        action={formAction}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
      {movie && <input type="hidden" name="id" value={movie.id} />}
      {isMultiPart && (
        <input type="hidden" name="episodeIds" value={episodes.map((episode) => episode.id).join(",")} />
      )}

      {state.message && (
        <p className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.message}
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-lg font-extrabold">Ibisobanuro bya filime</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2">
            <Label>Izina rya filime cyangwa season</Label>
            <input name="title" required defaultValue={movie?.title} className={inputClass} placeholder="Urugero: The Bucket List" />
          </label>
          <label>
            <Label hint="bizikora byonyine">Slug</Label>
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
          <label className="md:col-span-2">
            <Label>Ubwoko bw&apos;iki kintu</Label>
            <select
              name="kind"
              value={kind}
              onChange={(event) => setKind(event.target.value as MovieKind)}
              className={inputClass}
            >
              <option value="movie" className="bg-ink-2">Filime imwe</option>
              <option value="parts" className="bg-ink-2">Filime ifite ibice A, B, C...</option>
              <option value="season" className="bg-ink-2">Season / serie</option>
            </select>
            <span className="mt-2 flex items-start gap-2 text-xs leading-6 text-white/40">
              <Layers className="mt-1 size-4 shrink-0 text-gold" />
              {isSeason
                ? "Abareba bazabona ikarita imwe ya season, hanyuma babone ibice byayo byose."
                : kind === "parts"
                  ? "Abareba bazabona ikarita imwe, hanyuma babone ibice A, B, C bya filime."
                  : "Abareba bazabona filime imwe ishobora kurebwa hano cyangwa hanze."}
            </span>
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
        <h2 className="font-display text-lg font-extrabold">
          {isSeason
            ? "Ibigice bya season"
            : kind === "parts"
              ? "Ibice bya filime (A, B, C...)"
              : "Uko ikurikirwa"}
        </h2>

        {isMultiPart ? (
          <div className="mt-5 space-y-4">
            {episodes.length === 0 && (
              <p className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-5 text-sm text-white/40">
                Nta gice kiriho. Kanda &ldquo;Ongera igice&rdquo; hanyuma ushyire link iyariyo yose.
              </p>
            )}

            {episodes.map((episode, index) => (
              <div key={episode.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-sm font-bold text-white/70">
                    Igice {isSeason ? index + 1 : partLetter(index)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeEpisode(episode.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-400/20 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-400/10"
                  >
                    <Trash2 className="size-3.5" />
                    Kuraho
                  </button>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-[110px_1fr]">
                  <label>
                    <Label>Numero</Label>
                    <input
                      name={`episode-${episode.id}-number`}
                      type="number"
                      min={1}
                      value={episode.number}
                      onChange={(event) => updateEpisode(episode.id, { number: Number(event.target.value) })}
                      className={inputClass}
                    />
                  </label>
                  <label>
                    <Label>Izina ry&apos;igice</Label>
                    <input
                      name={`episode-${episode.id}-title`}
                      value={episode.title}
                      onChange={(event) => updateEpisode(episode.id, { title: event.target.value })}
                      className={inputClass}
                      placeholder="Urugero: Igice cya 1"
                    />
                  </label>
                  <label className="md:col-span-2">
                    <Label hint="http, https cyangwa izina rya domain gusa">Link y&apos;igice</Label>
                    <input
                      name={`episode-${episode.id}-url`}
                      value={episode.link}
                      onChange={(event) => updateEpisode(episode.id, { link: event.target.value })}
                      className={inputClass}
                      placeholder="https://vsembed.com/... cyangwa https://audinifer.com/..."
                    />
                  </label>
                  <p className="md:col-span-2 text-xs leading-6 text-white/40">
                    {isVsembedLink(episode.link)
                      ? "Iyi link izakina hano muri website."
                      : "Iyi link izafungurwa hanze kugira uyikine."}
                  </p>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addEpisode}
              className="inline-flex items-center gap-2 rounded-xl border border-gold/30 px-5 py-3 text-sm font-bold text-gold hover:bg-gold/10"
            >
              <Plus className="size-4" />
              Ongera igice
            </button>
            <p className="text-xs leading-6 text-white/40">
              Iyo wongeye igice ukabika, umubare w&apos;ibice kuri home no ku karita ya season uzihita uvugururwa.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label>
              <Label>Uburyo bwo kureba</Label>
              <select
                name="playback"
                value={playback}
                onChange={(event) => setPlayback(event.target.value as "embed" | "link")}
                className={inputClass}
              >
                <option value="embed" className="bg-ink-2">Kureba hano (embed)</option>
                <option value="link" className="bg-ink-2">Kuranga hanze (link)</option>
              </select>
            </label>
            <label>
              <Label>Source</Label>
              <input name="source" defaultValue={movie?.source} className={inputClass} placeholder="Urugero: Oshakur Films" />
            </label>
            <label className="md:col-span-2">
              <Label hint="Link yumwimerere cyangwa iyohereza hanze">Source URL</Label>
              <input name="sourceUrl" defaultValue={movie?.sourceUrl} className={inputClass} placeholder="https://..." />
            </label>
            <label className="md:col-span-2">
              <Label hint="link iyariyo yose (http/https)">Embed URL</Label>
              <input
                name="embedUrl"
                defaultValue={movie?.embedUrl ?? ""}
                className={inputClass}
                placeholder="https://..."
              />
            </label>
            <p className="md:col-span-2 text-xs leading-6 text-white/40">
              Shyira link iyariyo yose (http/https) muri Embed URL hanyuma hitamo &ldquo;Kureba hano&rdquo;
              — filime izakina muri ireberefilm. Niba urubuga rwabujije kwinjizwa muri iframe, hitamo
              &ldquo;Kuranga hanze&rdquo;.
            </p>
          </div>
        )}
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
          <label className="w-full sm:w-64">
            <Label>Urutonde muri Filime nshya</Label>
            <input
              name="homeOrder"
              type="number"
              defaultValue={movie?.homeOrder ?? ""}
              className={inputClass}
              placeholder="Automatic"
            />
            <span className="mt-1.5 block text-[11px] text-white/35">
              1 ni iya mbere. Usigaye ubusa, iya nyuma yashyizwe iza imbere.
            </span>
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
          {pending
            ? "Kubika..."
            : movie
              ? "Hindura"
              : isSeason
                ? "Ongera season"
                : kind === "parts"
                  ? "Ongera filime ifite ibice"
                  : "Ongera filime"}
        </button>
      </div>
      </motion.form>
      {movie && (
        <AdminCommentsPanel
          slug={movie.slug}
          movieId={movie.id}
          adminName={adminName}
          comments={comments}
        />
      )}
    </div>
  );
}
