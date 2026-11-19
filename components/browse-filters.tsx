"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ListFilter } from "lucide-react";

const selectClass =
  "rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white/60 outline-none transition-colors focus:border-gold/60";

export default function BrowseFilters({
  years,
  creators,
  kind,
  year,
  creator,
  sort,
  watchlistOnly,
}: {
  years: number[];
  creators: string[];
  kind: string;
  year: string;
  creator: string;
  sort: string;
  watchlistOnly: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all" || value === "false") next.delete(key);
    else next.set(key, value);
    router.replace(`/browse?${next.toString()}`);
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/35 uppercase">
        <ListFilter className="size-3.5" />
        Hiyoza
      </span>
      <select
        aria-label="Ubwoko"
        value={kind}
        onChange={(event) => update("kind", event.target.value)}
        className={selectClass}
      >
        <option value="all">Ubwoko bwose</option>
        <option value="movie">Filime imwe</option>
        <option value="season">Season</option>
        <option value="part">Ibice</option>
      </select>
      <select
        aria-label="Umwaka"
        value={year}
        onChange={(event) => update("year", event.target.value)}
        className={selectClass}
      >
        <option value="all">Imyaka yose</option>
        {years.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        aria-label="Umusobanuzi"
        value={creator}
        onChange={(event) => update("creator", event.target.value)}
        className={selectClass}
      >
        <option value="all">Abasobanuzi bose</option>
        {creators.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        aria-label="Uko zitondewe"
        value={sort}
        onChange={(event) => update("sort", event.target.value)}
        className={selectClass}
      >
        <option value="latest">Zikiri nshya</option>
        <option value="popular">Ibyamamaye</option>
        <option value="rating">Igereranya ry&apos;abareba</option>
        <option value="title">Izina (A-Z)</option>
      </select>
      <select
        aria-label="Byabitswe"
        value={watchlistOnly ? "1" : "all"}
        onChange={(event) => update("watchlist", event.target.value)}
        className={selectClass}
      >
        <option value="all">Zose</option>
        <option value="1">Byabitswe gusa</option>
      </select>
    </div>
  );
}
