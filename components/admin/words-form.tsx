"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { Save } from "lucide-react";
import { saveSettingsAction } from "@/lib/actions";
import type { SiteSettings } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-gold/60";

const fields: { key: keyof SiteSettings; label: string; hint?: string; area?: boolean }[] = [
  { key: "siteName", label: "Izina ry'urubuga" },
  { key: "tagline", label: "Interuro ya mbere (Hero)", area: true },
  { key: "heroCta", label: "Button ya Hero" },
  { key: "heroSecondary", label: "Button ya kabiri" },
  { key: "newTitle", label: "Umutwe wa filime nshya" },
  { key: "popularTitle", label: "Umutwe wa zikunzwe" },
  { key: "categoriesTitle", label: "Umutwe w'ibyiciro" },
  { key: "searchPlaceholder", label: "Ijambo ryo gushakisha" },
  { key: "aboutIntro", label: "Ibyerekeye (About)", area: true },
  { key: "footerText", label: "Ijambo rya footer", area: true },
  { key: "contactEmail", label: "Email yo kuvugana" },
];

export default function WordsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(saveSettingsAction, {
    ok: false,
    message: "",
  });

  return (
    <motion.form action={formAction} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-display text-lg font-extrabold">Amagambo agaragara kuri site</h2>
        <p className="mt-1 text-xs text-white/40">Uzuza uko ushaka ko byandikwa. Byose biri mu Kinyarwanda.</p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className={field.area ? "md:col-span-2" : ""}>
              <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">{field.label}</span>
              {field.area ? (
                <textarea
                  name={field.key}
                  rows={3}
                  defaultValue={settings[field.key]}
                  className={`${inputClass} resize-none`}
                />
              ) : (
                <input name={field.key} defaultValue={settings[field.key]} className={inputClass} />
              )}
            </label>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-4">
        {state.message && (
          <span className={`text-sm font-bold ${state.ok ? "text-emerald-300" : "text-rose-300"}`}>
            {state.message}
          </span>
        )}
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-extrabold text-ink hover:bg-amber-300 disabled:opacity-60"
        >
          <Save className="size-4" />
          {pending ? "Kubika..." : "Bika amagambo"}
        </button>
      </div>
    </motion.form>
  );
}
