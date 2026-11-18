"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Pin, PinOff, Send, Trash2 } from "lucide-react";
import { adminAddCommentAction, deleteCommentAction, pinCommentAction } from "@/lib/actions";
import { emptyActionState } from "@/lib/action-state";
import type { CommentRecord } from "@/lib/types";

type Props = {
  slug: string;
  movieId: string;
  adminName: string;
  comments: CommentRecord[];
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-gold/60";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("rw-RW", {
    dateStyle: "medium",
    timeZone: "Africa/Kigali",
  }).format(new Date(value));
}

export default function AdminCommentsPanel({ slug, movieId, adminName, comments }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(adminAddCommentAction, emptyActionState);

  useEffect(() => {
    if (state.ok && state.message) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="size-5 text-gold" />
        <h2 className="font-display text-lg font-extrabold">Ubutumwa bw&apos;abareba</h2>
      </div>
      <p className="mt-2 text-sm text-white/45">
        Shyira ubutumwa bwawe hejuru, cyangwa ushyire hejuru ubwo abandi banditse.
      </p>

      <form ref={formRef} action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="movieId" value={movieId} />
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">
              Izina
            </span>
            <input name="name" required maxLength={60} defaultValue={adminName} className={inputClass} />
          </label>
          <label>
            <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">
              Ubutumwa
            </span>
            <input name="message" required maxLength={1200} placeholder="Urugero: Reba igice cya B hano..." className={inputClass} />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-bold text-white/70">
            <input name="pinned" type="checkbox" className="size-4 accent-[#f7b733]" />
            Shyira hejuru
          </label>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-extrabold text-ink hover:bg-amber-300 disabled:opacity-60"
          >
            <Send className="size-4" />
            {pending ? "Kubika..." : "Ongera ubutumwa"}
          </button>
          {state.message && (
            <p aria-live="polite" className={`text-sm ${state.ok ? "text-mint" : "text-rose-300"}`}>
              {state.message}
            </p>
          )}
        </div>
      </form>

      <div className="mt-7 space-y-3">
        {comments.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-5 text-sm text-white/40">
            Nta butumwa buriho kuri iyi filime.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-xl border p-4 ${
                comment.pinned ? "border-gold/30 bg-gold/[0.04]" : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-sm font-extrabold text-white">
                    {comment.name}
                    {comment.pinned && <span className="ml-2 text-xs font-bold text-gold">· hejuru</span>}
                  </p>
                  <p className="mt-1 text-xs text-white/30">{formatDate(comment.createdAt)}</p>
                  <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-white/70">
                    {comment.message}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={pinCommentAction}>
                    <input type="hidden" name="commentId" value={comment.id} />
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="movieId" value={movieId} />
                    <input type="hidden" name="pinned" value={comment.pinned ? "0" : "1"} />
                    <button
                      type="submit"
                      title={comment.pinned ? "Kuraho hejuru" : "Shyira hejuru"}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white/55 hover:border-gold/40 hover:text-gold"
                    >
                      {comment.pinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
                      {comment.pinned ? "Kuraho hejuru" : "Shyira hejuru"}
                    </button>
                  </form>
                  <form action={deleteCommentAction}>
                    <input type="hidden" name="commentId" value={comment.id} />
                    <input type="hidden" name="slug" value={slug} />
                    <input type="hidden" name="movieId" value={movieId} />
                    <button
                      type="submit"
                      title="Siba ubutumwa"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/20 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-400/10"
                    >
                      <Trash2 className="size-3.5" />
                      Siba
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
