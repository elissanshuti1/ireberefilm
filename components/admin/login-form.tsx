"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { loginAction } from "@/lib/actions";
import { emptyActionState } from "@/lib/action-state";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, emptyActionState);

  return (
    <motion.form
      action={formAction}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 space-y-5"
    >
      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-white/50 uppercase">
          <UserRound className="size-3.5" /> Izina
        </span>
        <input
          name="username"
          autoComplete="username"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-gold/60"
          placeholder="Andika izina"
        />
      </label>

      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-white/50 uppercase">
          <LockKeyhole className="size-3.5" /> Ijambo ry&apos;ibanga
        </span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-gold/60"
          placeholder="••••••••"
        />
      </label>

      {state.message && (
        <p className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 text-sm font-extrabold text-ink transition-all hover:bg-amber-300 disabled:opacity-60"
      >
        {pending ? "Kwinjira..." : "Kwinjira"}
        <ArrowRight className="size-4" />
      </button>
    </motion.form>
  );
}
