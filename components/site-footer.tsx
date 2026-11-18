import Link from "next/link";
import { ArrowUpRight, Film, Heart, Play, Sparkles } from "lucide-react";

const columns = [
  {
    title: "Shakisha",
    links: [
      { label: "Filime nshya", href: "/browse" },
      { label: "Zikunzwe cyane", href: "/browse?genre=Drama" },
      { label: "Ibyiciro byose", href: "/browse" },
    ],
  },
  {
    title: "Urubuga",
    links: [
      { label: "Ibyacu", href: "/about" },
      { label: "Ubufatanye", href: "/about#ubufatanye" },
      { label: "Icyubahiro", href: "/about#icyubahiro" },
    ],
  },
];

export default function SiteFooter({
  footerText = "Agasobanuye kose, ahantu hamwe. Duhuza abakunda filime z'isi yose zisobanurwa mu Kinyarwanda n'abatangiza zidateganyijwe.",
  contactEmail = "ubufatanye@ireberefilm.rw",
}: {
  footerText?: string;
  contactEmail?: string;
}) {
  return (
    <footer className="noise relative overflow-hidden border-t border-white/10 bg-ink-2">
      <div className="aurora aurora-fade pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/4 size-96 rounded-full bg-violet/20 orb orb-slow" />

      <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-8 sm:px-8">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="relative grid size-11 place-items-center rounded-xl bg-gradient-to-br from-gold to-orange-600 shadow-[0_0_35px_-10px_rgba(247,183,51,0.9)] transition-transform duration-500 group-hover:rotate-6">
                <Play className="size-4 translate-x-px fill-ink text-ink" />
              </span>
              <span className="font-display text-2xl font-extrabold tracking-tight">
                irebere<span className="text-gold">film</span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-white/50">{footerText}</p>
            <div className="mt-7 flex gap-2">
              {["IG", "YT", "WA", "FB"].map((item, index) => (
                <span
                  key={item}
                  className="glass-soft grid size-10 place-items-center rounded-full text-[11px] font-bold text-white/50 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:text-gold"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-display text-sm font-bold tracking-[0.18em] text-white/80 uppercase">
                {column.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-sm font-bold tracking-[0.18em] text-white/80 uppercase">
              Tumenye byose
            </h3>
            <p className="mt-6 text-sm leading-6 text-white/50">
              Filime nshya, ibyiciro n&apos;abasobanuzi. Byose mu Kinyarwanda.
            </p>
            <div className="glass-soft mt-6 flex items-center gap-2 rounded-full p-1.5 pl-4 transition-colors focus-within:border-gold/50">
              <Film className="size-4 text-gold" />
              <input
                type="text"
                placeholder={contactEmail}
                aria-label="Imeyili yawe"
                className="w-full min-w-0 bg-transparent py-2 text-sm outline-none placeholder:text-white/30"
              />
              <button
                type="button"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-gold text-ink transition-transform hover:scale-105"
                aria-label="Andikira"
              >
                <ArrowUpRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ireberefilm · Yakozwe mu Rwanda</p>
          <p className="flex items-center gap-2">
            <Sparkles className="size-3 text-gold" />
            Gukunda filime, mu buryo bwacu
            <Heart className="size-3 fill-rose-400 text-rose-400" />
          </p>
        </div>
      </div>
    </footer>
  );
}
