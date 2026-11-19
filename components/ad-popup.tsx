"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Megaphone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AdRecord } from "@/lib/types";

type Props = {
  ad: AdRecord | null;
  slug: string;
  placement?: "movie_popup";
};

export default function AdPopup({ ad, slug, placement = "movie_popup" }: Props) {
  const [open, setOpen] = useState(false);
  const tracked = useRef(false);
  const currentId = ad?.id ?? "";
  const frequency = ad?.popupFrequency ?? "per_visit";

  useEffect(() => {
    if (!currentId) return;
    let shouldShow = true;
    if (frequency !== "every_page") {
      const key =
        frequency === "per_movie"
          ? `irebere_ad_${currentId}_movie_${slug}`
          : `irebere_ad_${currentId}_visit`;
      try {
        shouldShow = !window.sessionStorage.getItem(key);
        if (shouldShow) window.sessionStorage.setItem(key, "1");
      } catch {
        shouldShow = true;
      }
    }
    if (!shouldShow) return;
    const timer = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, [currentId, frequency, slug]);

  useEffect(() => {
    if (!open || !currentId || tracked.current) return;
    tracked.current = true;
    fetch("/api/ads/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adId: currentId,
        placement,
        path: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [open, currentId, placement]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!ad || !open) return null;

  const href = ad.link
    ? `/api/ads/click/${ad.id}?placement=${encodeURIComponent(placement)}`
    : "";

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-[#03040a]/95 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={ad.title}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative flex min-h-[21rem] w-[min(88vw,22rem)] flex-col overflow-hidden rounded-[28px] bg-white text-slate-900 shadow-[0_50px_150px_-30px_rgba(0,0,0,1)] ring-1 ring-black/10"
      >
        <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-black tracking-[0.2em] text-white uppercase">
              <Megaphone className="size-3.5" />
              Advertisement
            </div>
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
              aria-label="Funga"
            >
              <X className="size-5" />
            </button>
          </div>

          <p className="mt-8 text-xs font-black tracking-[0.18em] text-amber-600 uppercase">
            {ad.advertiser}
          </p>
          <h2 className="font-display mt-3 text-2xl leading-[1.08] font-black sm:text-3xl">
            {ad.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{ad.message}</p>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <p className="text-xs leading-5 text-slate-400">
              Iyi ni yamamajwe. Funga kugira ukomeze kureba filime.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2.5 text-[11px] font-black text-slate-600 transition-colors hover:bg-slate-100"
              >
                Funga
              </button>
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-[10rem] items-center gap-1.5 truncate rounded-full bg-slate-900 px-4 py-2.5 text-[11px] font-black text-white transition-colors hover:bg-amber-500 hover:text-slate-900"
                >
                  {ad.ctaLabel}
                  <ArrowUpRight className="size-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
