"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MessageSquare, Send } from "lucide-react";
import { addCommentAction } from "@/lib/actions";
import { emptyActionState } from "@/lib/action-state";
import type { CommentRecord, GlobalComment } from "@/lib/types";

type Props = {
  slug: string;
  comments: CommentRecord[];
  globalComment: GlobalComment | null;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-gold/60";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("rw-RW", {
    dateStyle: "medium",
    timeZone: "Africa/Kigali",
  }).format(new Date(value));
}

export default function CommentSection({ slug, comments, globalComment }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(addCommentAction, emptyActionState);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (state.ok && state.message) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  const visible = comments.slice(0, visibleCount);
  const remaining = comments.length - visible.length;

  return (
    <section id="ubutumwa" className="relative border-y border-white/[0.06] bg-ink-2/60 py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.24em] text-gold uppercase">
              <span className="h-px w-8 bg-gold" />
              Ubutumwa bw&apos;abareba
            </p>
            <h2 className="font-display mt-4 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
              Mugabane ubutumwa bwawe
            </h2>
            <p className="mt-3 text-sm text-white/45">
              {comments.length === 0
                ? "Nta butumwa buriho. Bwira abandi uko uyibona."
                : `${comments.length} ${comments.length === 1 ? "ubutumwa" : "ubutumwa"} buriho.`}
            </p>
          </div>
          <MessageSquare className="hidden size-10 text-gold/25 sm:block" />
        </div>

        {globalComment && (
          <article className="mt-8 rounded-2xl border border-gold/40 bg-gold/[0.07] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-sm font-extrabold text-white">{globalComment.name}</p>
              <span className="text-xs text-white/30">·</span>
              <time className="text-xs text-white/35" dateTime={globalComment.updatedAt}>
                {formatDate(globalComment.updatedAt)}
              </time>
              <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[10px] font-bold text-gold uppercase">
                Umuyobozi
              </span>
              <span className="rounded-full border border-mint/25 bg-mint/10 px-2.5 py-1 text-[10px] font-bold text-mint uppercase">
                Iyashyizwe kuri filime zose
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-white/80">
              {globalComment.message}
            </p>
          </article>
        )}

        <form ref={formRef} action={formAction} className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <input type="hidden" name="slug" value={slug} />
          <div className="hidden" aria-hidden="true">
            <input name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
            <label>
              <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">
                Izina ryawe
              </span>
              <input name="name" required maxLength={60} placeholder="Urugero: Kelly" className={inputClass} />
            </label>
            <label>
              <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">
                Ubutumwa bwawe
              </span>
              <textarea
                name="message"
                required
                maxLength={1200}
                rows={3}
                placeholder="Wandike uko wabonye iyi filime..."
                className={`${inputClass} resize-y`}
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-extrabold text-ink transition-colors hover:bg-amber-300 disabled:opacity-60"
            >
              <Send className="size-4" />
              {pending ? "Kubika..." : "Ohereza ubutumwa"}
            </button>
            {state.message && (
              <p
                aria-live="polite"
                className={`text-sm ${state.ok ? "text-mint" : "text-rose-300"}`}
              >
                {state.message}
              </p>
            )}
          </div>
        </form>

        {comments.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-8 text-sm text-white/40">
            Nta butumwa buriho ubu. Wa mbere washobora kuba uwa mbere.
          </p>
        ) : (
          <>
            <div className="mt-8 space-y-3">
              {visible.map((comment) => (
                <article
                  key={comment.id}
                  className={`glass-soft rounded-2xl p-5 ${
                    comment.pinned ? "border-gold/30 bg-gold/[0.04]" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-sm font-extrabold text-white">{comment.name}</p>
                    <span className="text-xs text-white/30">·</span>
                    <time className="text-xs text-white/35" dateTime={comment.createdAt}>
                      {formatDate(comment.createdAt)}
                    </time>
                    {comment.authorRole === "admin" && (
                      <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[10px] font-bold text-gold uppercase">
                        Umuyobozi
                      </span>
                    )}
                    {comment.pinned && (
                      <span className="rounded-full border border-mint/25 bg-mint/10 px-2.5 py-1 text-[10px] font-bold text-mint uppercase">
                        Iyashyizwe hejuru
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-white/70">
                    {comment.message}
                  </p>
                </article>
              ))}
            </div>
            {remaining > 0 && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((current) => current + 5)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white/60 transition-all hover:border-gold/50 hover:text-gold"
                >
                  Reba ubutumwa bundi ({remaining})
                  <ChevronDown className="size-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
