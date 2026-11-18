"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type AnalyticsType = "page_view" | "movie_view" | "movie_click";

function slugFromPath(path: string) {
  const raw = path.split("?")[0].split("/")[2] ?? "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function sendEvent(type: AnalyticsType, path: string, slug = "", title = "") {
  const payload = JSON.stringify({
    type,
    path,
    slug,
    title,
    referrer: typeof document === "undefined" ? "" : document.referrer,
  });

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      "/api/analytics",
      new Blob([payload], { type: "application/json" }),
    );
    if (sent) return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const key = `irebere_view:${pathname}`;
    let shouldSend = true;
    try {
      const last = Number(sessionStorage.getItem(key) ?? 0);
      shouldSend = Date.now() - last > 15000;
      if (shouldSend) sessionStorage.setItem(key, String(Date.now()));
    } catch {
      shouldSend = true;
    }
    if (!shouldSend) return;

    const slug = pathname.startsWith("/movies/") ? slugFromPath(pathname) : "";
    const title = document.title.split(" | ")[0] ?? "";
    sendEvent("page_view", pathname, slug, title);
    if (slug) sendEvent("movie_view", pathname, slug, title);
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (pathname.startsWith("/admin")) return;
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href^="/movies/"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      const slug = slugFromPath(href);
      const title =
        anchor.querySelector("img")?.getAttribute("alt") ??
        anchor.textContent?.trim().slice(0, 120) ??
        "";
      sendEvent("movie_click", href, slug, title);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  return null;
}
