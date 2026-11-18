"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { savePinnedCommentAction } from "@/lib/actions";
import { emptyActionState } from "@/lib/action-state";
import type { GlobalComment } from "@/lib/types";

type Props = { initial: GlobalComment | null };

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-gold/60";

export default function PinnedCommentForm({ initial }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(savePinnedCommentAction, emptyActionState);

  useEffect(() => {
    if (state.ok && state.message) router.refresh();
  }, [state, router]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[240px_1fr]">
        <label>
          <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">
            Izina
          </span>
          <input
            name="name"
            maxLength={60}
            defaultValue={initial?.name ?? "Ireberefilm"}
            placeholder="Urugero: Kelly"
            className={inputClass}
          />
        </label>
        <label>
          <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">
            Ubutumwa bwashyizwe kuri filime zose
          </span>
          <textarea
            name="message"
            maxLength={1200}
            rows={3}
            defaultValue={initial?.message ?? ""}
            placeholder="Andika ubutumwa uzashyira hejuru kuri buri filime..."
            className={`${inputClass} resize-y`}
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-extrabold text-ink hover:bg-amber-300 disabled:opacity-60"
        >
          {pending ? "Kubika..." : "Bika ubutumwa"}
          <Send className="size-4" />
        </button>
        {state.message && (
          <p aria-live="polite" className={`text-sm ${state.ok ? "text-mint" : "text-rose-300"}`}>
            {state.message}
          </p>
        )}
      </div>
      <p className="text-xs leading-6 text-white/40">
        Niba usige ubutumwa busa, ntibuzagaragara kuri filime. Ushobora kongera kuwandika igihe
        cyose ukabika.
      </p>
    </form>
  );
}
