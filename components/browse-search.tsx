"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function BrowseSearch({
  initialQuery,
  genre,
  placeholder,
}: {
  initialQuery: string;
  genre: string;
  placeholder: string;
}) {
  const router = useRouter();
  const current = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  const target = useCallback(
    (text: string) => {
      const params = new URLSearchParams(current.toString());
      const trimmed = text.trim();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      if (genre !== "Zose") params.set("genre", genre);
      else params.delete("genre");
      const search = params.toString();
      return `/browse${search ? `?${search}` : ""}`;
    },
    [current, genre],
  );

  useEffect(() => {
    if (value.trim() === initialQuery.trim()) return;
    const timer = window.setTimeout(() => {
      router.replace(target(value), { scroll: false });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [value, initialQuery, router, target]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    router.replace(target(value), { scroll: false });
  };

  return (
    <form
      onSubmit={submit}
      className="glass group flex items-center gap-2 rounded-xl p-1.5 pl-3 transition-all focus-within:border-gold/50"
    >
      <Search className="size-4 shrink-0 text-gold" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Shakisha filime"
        className="w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/30"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-gold px-4 py-2 text-xs font-extrabold text-ink transition-transform hover:scale-105"
      >
        Shakisha
      </button>
    </form>
  );
}
