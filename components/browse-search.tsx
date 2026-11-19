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
      className="glass group flex items-center gap-4 rounded-2xl p-2 pl-5 transition-all focus-within:border-gold/50"
    >
      <Search className="size-5 shrink-0 text-gold" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label="Shakisha filime"
        className="w-full bg-transparent py-4 text-base text-white outline-none placeholder:text-white/30"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-gold px-6 py-3.5 text-sm font-extrabold text-ink transition-transform hover:scale-105"
      >
        Shakisha
      </button>
    </form>
  );
}
