"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    if (value.trim() === initialQuery.trim()) return;
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      const trimmed = value.trim();
      if (trimmed) params.set("q", trimmed);
      if (genre !== "Zose") params.set("genre", genre);
      const search = params.toString();
      router.replace(`/browse${search ? `?${search}` : ""}`, { scroll: false });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [value, genre, initialQuery, router]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmed = value.trim();
    if (trimmed) params.set("q", trimmed);
    if (genre !== "Zose") params.set("genre", genre);
    const search = params.toString();
    router.replace(`/browse${search ? `?${search}` : ""}`, { scroll: false });
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
