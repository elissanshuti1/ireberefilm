import Link from "next/link";
import { ArrowUpRight, Film, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <main className="noise relative grid min-h-screen place-items-center overflow-hidden px-5 pt-[76px]">
      <div className="aurora aurora-fade pointer-events-none absolute inset-0" />
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 orb" />

      <div className="relative text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
          <Film className="size-7" />
        </div>
        <p className="font-display mt-8 text-[120px] leading-none font-extrabold tracking-tighter text-gradient sm:text-[180px]">
          404
        </p>
        <h1 className="font-display mt-2 text-2xl font-extrabold sm:text-3xl">
          Iyi filime ntiboneka.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-white/45">
          Ariko hari izindi filime nyinshi zishobora kukungahaza. Reba hano hasi.
        </p>
        <Link
          href="/browse"
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-extrabold text-ink transition-all hover:gap-5"
        >
          <Sparkles className="size-4" />
          Reba filime zose
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </main>
  );
}
