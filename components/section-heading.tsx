import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Zose reba",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <Reveal className="mb-9 flex flex-wrap items-end justify-between gap-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold" />
          <p className="text-[11px] font-bold tracking-[0.24em] text-gold uppercase">{eyebrow}</p>
        </div>
        <h2 className="font-display mt-4 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && <p className="mt-3 max-w-xl text-sm leading-7 text-white/50">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white/70 transition-all hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
        >
          {linkLabel}
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </Reveal>
  );
}
