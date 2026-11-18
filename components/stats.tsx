"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { Film, Globe2, Heart, Play } from "lucide-react";
import { useEffect, useRef } from "react";
import Reveal from "@/components/reveal";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.8, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, count, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export default function Stats({
  moviesCount = 240,
  genresCount = 12,
}: {
  moviesCount?: number;
  genresCount?: number;
}) {
  const stats = [
    { value: moviesCount, suffix: "+", label: "Filime zirimo", icon: Film },
    { value: 18, suffix: "K", label: "Abazireba", icon: Play },
    { value: genresCount, suffix: "", label: "Ibyiciro", icon: Heart },
    { value: 1, suffix: "", label: "Ururimi rwacu", icon: Globe2 },
  ];

  return (
    <section className="relative border-y border-white/[0.06] bg-ink-2/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-5 py-2 sm:px-8 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.09}>
            <div className="group flex items-center gap-4 px-2 py-8 sm:px-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-gold transition-all duration-500 group-hover:rotate-6 group-hover:border-gold/40 group-hover:bg-gold/10">
                <stat.icon className="size-5" />
              </span>
              <div>
                <p className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-white/40 uppercase">
                  {stat.label}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
