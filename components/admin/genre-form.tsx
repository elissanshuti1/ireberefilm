"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { Plus, Save } from "lucide-react";
import { saveGenreAction } from "@/lib/actions";
import { emptyActionState } from "@/lib/action-state";
import type { GenreRecord } from "@/lib/types";

const inputClass =
  "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-gold/60";

export default function GenreForm({ genre, compact = false }: { genre?: GenreRecord; compact?: boolean }) {
  const [state, formAction, pending] = useActionState(saveGenreAction, emptyActionState);

  if (compact) {
    return (
      <form action={formAction} className="flex flex-wrap items-center gap-2">
        {genre && <input type="hidden" name="id" value={genre.id} />}
        <input name="name" required defaultValue={genre?.name} className={`${inputClass} w-36`} placeholder="Izina" />
        <input name="color" type="color" defaultValue={genre?.color ?? "#f7b733"} className="size-10 cursor-pointer rounded-lg border border-white/10 bg-white/5 p-1" />
        <input name="order" type="number" defaultValue={genre?.order ?? 0} className={`${inputClass} w-20`} title="Urutonde" />
        <button type="submit" disabled={pending} className="grid size-10 place-items-center rounded-xl bg-gold text-ink disabled:opacity-60" title="Bika">
          <Save className="size-4" />
        </button>
        {state.message && <span className="text-xs text-rose-300">{state.message}</span>}
      </form>
    );
  }

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-end gap-4"
    >
      <label>
        <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">Izina ry&apos;icyiciro</span>
        <input name="name" required className={`${inputClass} w-64`} placeholder="Urugero: Adventure" />
      </label>
      <label>
        <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">Ibara</span>
        <input name="color" type="color" defaultValue="#f7b733" className="size-11 cursor-pointer rounded-xl border border-white/10 bg-white/5 p-1" />
      </label>
      <label>
        <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">Urutonde</span>
        <input name="order" type="number" defaultValue={0} className={`${inputClass} w-24`} />
      </label>
      <button type="submit" disabled={pending} className="flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-extrabold text-ink hover:bg-amber-300 disabled:opacity-60">
        <Plus className="size-4" /> Ongera
      </button>
      {state.message && <span className="w-full text-xs text-rose-300">{state.message}</span>}
    </motion.form>
  );
}
