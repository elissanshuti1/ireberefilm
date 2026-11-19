"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Megaphone, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { adImageSrc } from "@/lib/ads";
import type { AdPlacement, AdRecord } from "@/lib/types";

type Props = {
  ads: AdRecord[];
};

function placementForPath(pathname: string): AdPlacement {
  if (pathname.startsWith("/movies/")) return "movie_banner";
  if (pathname.startsWith("/browse")) return "browse_top";
  return "home_after_hero";
}

export default function AdSlot({ ads }: Props) {
  const pathname = usePathname();
  const [tick, setTick] = useState(0);
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set());
  const tracked = useRef(new Set<string>());
  const placement = placementForPath(pathname);

  useEffect(() => {
    if (ads.length <= 3) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 10000);
    return () => window.clearInterval(timer);
  }, [ads.length]);

  const visible = useMemo(() => {
    const batchSize = 3;
    const pageCount = Math.max(1, Math.ceil(ads.length / batchSize));
    const batch = tick % pageCount;
    return ads.slice(batch * batchSize, batch * batchSize + batchSize);
  }, [ads, tick]);

  const visibleAds = useMemo(
    () => visible.filter((ad) => !closedIds.has(ad.id)),
    [visible, closedIds],
  );

  useEffect(() => {
    for (const ad of visibleAds) {
      const key = `${ad.id}:${placement}`;
      if (tracked.current.has(key)) continue;
      tracked.current.add(key);
      fetch("/api/ads/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: ad.id, placement, path: pathname }),
        keepalive: true,
      }).catch(() => {});
    }
  }, [visibleAds, placement, pathname]);

  if (visibleAds.length === 0) return null;

  return (
    <div className="fixed top-20 right-3 z-[60] flex flex-col gap-3 sm:top-24 sm:right-6 sm:gap-4">
      {visibleAds.map((ad) => {
        const image = adImageSrc(ad);
        const href = ad.link
          ? `/api/ads/click/${ad.id}?placement=${encodeURIComponent(placement)}`
          : "";

        return (
          <div
            key={ad.id}
            aria-label="Advertisement"
            title={`${ad.advertiser}: ${ad.message}`}
            className="float-medium relative size-36 overflow-hidden rounded-3xl bg-white text-slate-900 shadow-[0_28px_70px_-18px_rgba(0,0,0,0.95)] ring-1 ring-black/10 sm:size-44"
          >
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${ad.title} - ${ad.ctaLabel}`}
                className="absolute inset-0 z-0 transition-transform hover:scale-105"
              />
            ) : null}

            <div className="pointer-events-none absolute inset-0 z-10">
              {image ? (
                <Image src={image} alt="" fill className="object-cover" sizes="176px" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-white to-orange-100">
                  <div className="absolute -top-6 -right-6 size-24 rounded-full bg-amber-300/40 blur-xl" />
                  <Megaphone className="absolute top-5 left-1/2 size-8 -translate-x-1/2 text-amber-600" />
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-white/95 p-2.5 backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[8px] font-black tracking-[0.18em] text-white">
                    AD
                  </span>
                  <span className="truncate text-[8px] font-black tracking-wider text-slate-500 uppercase">
                    Yamamajwe
                  </span>
                </div>
                <p className="mt-1.5 truncate text-[9px] font-black text-amber-600 uppercase">
                  {ad.advertiser}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 font-black text-slate-900">
                  {ad.title}
                </p>
                <p className="mt-1 line-clamp-3 text-[10px] leading-[13px] text-slate-600">
                  {ad.message}
                </p>
                {href ? (
                  <span className="mt-1.5 inline-flex max-w-full items-center gap-1 truncate text-[9px] font-black text-slate-700">
                    {ad.ctaLabel}
                    <ArrowUpRight className="size-2.5 shrink-0" />
                  </span>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setClosedIds((current) => {
                  const next = new Set(current);
                  next.add(ad.id);
                  return next;
                })
              }
              aria-label="Funga iyamamajwe"
              className="absolute top-2 right-2 z-20 grid size-6 place-items-center rounded-full bg-slate-900/85 text-white shadow-md transition-colors hover:bg-slate-900 lg:hidden"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
