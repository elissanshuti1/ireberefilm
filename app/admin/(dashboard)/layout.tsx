import Link from "next/link";
import { LogOut, Sparkles } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";
import AdminNav from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#080a12] text-white">
      <AdminNav />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-ink-2/85 px-4 py-4 backdrop-blur-xl sm:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-display font-extrabold lg:hidden">
            <span className="grid size-8 place-items-center rounded-lg bg-gold text-ink">
              <Sparkles className="size-4" />
            </span>
            irebere<span className="text-gold">film</span>
          </Link>
          <div className="hidden lg:block">
            <p className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase">Ubuyobozi</p>
            <p className="text-sm font-bold text-white/70">Ireberefilm Admin</p>
          </div>
          <nav className="flex items-center gap-3 text-xs font-bold lg:hidden">
            <Link href="/admin/movies" className="text-white/55">Filime</Link>
            <Link href="/admin/ads" className="text-white/55">Ads</Link>
            <Link href="/admin/genres" className="text-white/55">Ibyiciro</Link>
            <Link href="/admin/words" className="text-white/55">Amagambo</Link>
            <Link href="/admin/comments" className="text-white/55">Comments</Link>
            <Link href="/admin/pin-comment" className="text-gold">Pin</Link>
            <form action={logoutAction}>
              <button type="submit" aria-label="Sohoka" className="grid size-8 place-items-center rounded-lg border border-white/10 text-rose-300">
                <LogOut className="size-3.5" />
              </button>
            </form>
          </nav>
          <form action={logoutAction} className="hidden lg:block">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white/50 transition-colors hover:border-rose-400/40 hover:text-rose-300"
            >
              <LogOut className="size-3.5" /> Sohoka
            </button>
          </form>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
