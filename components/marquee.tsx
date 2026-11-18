const words = [
  "AGASOBANUYE",
  "MU KINYARWANDA",
  "FILIME NZIZA",
  "IREBEREFILM",
  "REBA · SANGIRA · KUNDA",
];

export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  const content = [...words, ...words];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-gold/[0.04] py-4">
      <div className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}>
        {content.map((word, index) => (
          <span key={`${word}-${index}`} className="flex items-center gap-8 pr-8">
            <span className="font-display text-lg font-extrabold tracking-[0.12em] text-white/25 uppercase sm:text-2xl">
              {word}
            </span>
            <span className="size-1.5 rotate-45 bg-gold/70" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
