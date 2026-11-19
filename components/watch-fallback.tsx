"use client";

import { Copy, ExternalLink, TriangleAlert } from "lucide-react";
import { useState } from "react";

export default function WatchFallback({
  slug,
  title,
  sourceUrl,
}: {
  slug: string;
  title: string;
  sourceUrl?: string;
}) {
  const [message, setMessage] = useState("");

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Isano ryakopiriwe.");
    } catch {
      setMessage("Ntushoboye kukopira isano. Ongera ugerageze.");
    }
  };

  const report = async () => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "playback_error",
          path: window.location.pathname,
          slug,
          title,
        }),
      });
      setMessage("Murakoze, ikibazo cyanditswe.");
    } catch {
      setMessage("Ntushoboye kohereza raporo. Ongera ugerageze.");
    }
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-white/40">
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 font-bold transition-colors hover:border-gold/40 hover:text-gold"
      >
        <Copy className="size-3.5" />
        Kopera isano
      </button>
      {sourceUrl && sourceUrl !== "#" && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 font-bold transition-colors hover:border-gold/40 hover:text-gold"
        >
          <ExternalLink className="size-3.5" />
          Gerageza hanze
        </a>
      )}
      <button
        type="button"
        onClick={report}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 font-bold transition-colors hover:border-amber-300/40 hover:text-amber-200"
      >
        <TriangleAlert className="size-3.5" />
        Rapora ikibazo
      </button>
      {message && <span aria-live="polite">{message}</span>}
    </div>
  );
}
