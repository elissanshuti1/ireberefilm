"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Film, LayoutDashboard, LogOut, Sparkles, Tags, Type } from "lucide-react";
import { logoutAction } from "@/lib/actions";

const links = [
  { href: "/admin", label: "Incio", icon: LayoutDashboard },
  { href: "/admin/movies", label: "Filime", icon: Film },
  { href: "/admin/genres", label: "Ibyiciro", icon: Tags },
  { href: "/admin/words", label: "Amagambo", icon: Type },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-ink-2 px-4 py-6 lg:flex">
      <Link href="/admin" className="flex items-center gap-3 px-2">
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-gold to-orange-600 text-ink">
          <Sparkles className="size-5" />
        </span>
        <span className="font-display text-lg font-extrabold">
          irebere<span className="text-gold">film</span>
          <span className="block text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase">Admin</span>
        </span>
      </Link>

      <nav className="mt-12 space-y-1">
        {links.map((link) => {
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                active ? "text-ink" : "text-white/50 hover:text-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="admin-nav"
                  className="absolute inset-0 rounded-xl bg-gold"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <link.icon className="relative size-4" />
              <span className="relative">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white/50 transition-colors hover:text-gold"
        >
          <Film className="size-4" />
          Reba urubuga
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm font-bold text-rose-300 transition-colors hover:bg-rose-500/15"
          >
            <LogOut className="size-4" />
            Sohoka
          </button>
        </form>
      </div>
    </aside>
  );
}
