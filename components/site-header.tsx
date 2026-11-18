"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, Play, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Iburanga" },
  { href: "/browse", label: "Filime" },
  { href: "/browse?genre=Drama", label: "Ibyiciro" },
  { href: "/about", label: "Ibyacu" },
];

export default function SiteHeader({
  searchPlaceholder = "Shakisha filime, izina, cyangwa umusobanuzi...",
}: {
  searchPlaceholder?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/browse?q=${encodeURIComponent(trimmed)}` : "/browse");
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-white/10 bg-ink/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(false);
            }}
            className="group flex items-center gap-3"
            aria-label="ireberefilm home"
          >
            <span className="relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-gold to-orange-600 shadow-[0_0_30px_-8px_rgba(247,183,51,0.9)] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
              <span className="absolute inset-0 rounded-xl border border-white/30 spin-slow" />
              <Play className="size-4 translate-x-px fill-ink text-ink" strokeWidth={2.5} />
            </span>
            <span className="font-display text-[21px] font-extrabold tracking-tight">
              irebere<span className="text-gold">film</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href.split("?")[0]) && link.href !== "/";
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setMenuOpen(false);
                    setSearchOpen(false);
                  }}
                  className="relative rounded-full px-4 py-2 text-sm font-semibold text-white/60 transition-colors hover:text-white"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
              aria-label="Shakisha filime"
            >
              <Search className="size-[18px] transition-transform duration-300 group-hover:scale-110" />
            </button>
            <Link
              href="/browse"
              className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition-all duration-300 hover:gap-3 hover:bg-gold sm:flex"
            >
              Reba Filime
              <ArrowUpRight className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white lg:hidden"
              aria-label={menuOpen ? "Funga menu" : "Fungura menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col justify-center gap-3 px-8">
              {links.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * index, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => {
                      setMenuOpen(false);
                      setSearchOpen(false);
                    }}
                    className="font-display flex items-center justify-between border-b border-white/10 py-5 text-4xl font-bold text-white transition-colors hover:text-gold"
                  >
                    {link.label}
                    <ArrowUpRight className="size-6 text-gold" />
                  </Link>
                </motion.div>
              ))}
              <p className="mt-10 text-sm text-white/40">Agasobanuye mu Kinyarwanda · ireberefilm</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/90 px-5 pt-[18vh] backdrop-blur-2xl"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ opacity: 0, y: -30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
              onSubmit={submitSearch}
              onClick={(event) => event.stopPropagation()}
              className="glass w-full max-w-2xl rounded-3xl p-3 shadow-2xl"
            >
              <div className="flex items-center gap-4 px-4">
                <Search className="size-6 text-gold" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent py-5 text-lg text-white outline-none placeholder:text-white/35"
                  aria-label="Shakisha filime"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white/60 hover:text-white"
                  aria-label="Funga gushakisha"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 px-5 pt-3 pb-1 text-xs text-white/35">
                <span>Kanda Enter kugira ushakishe</span>
                <span className="text-gold">ESC kufunga</span>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
