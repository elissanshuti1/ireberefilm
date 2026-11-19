"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  CornerDownRight,
  Flag,
  Heart,
  MessageSquare,
  Reply,
  Send,
} from "lucide-react";
import {
  addCommentAction,
  reportCommentAction,
  toggleCommentLikeAction,
} from "@/lib/actions";
import { emptyActionState } from "@/lib/action-state";
import type { CommentView, GlobalComment } from "@/lib/types";

type Props = {
  slug: string;
  comments: CommentView[];
  globalComment: GlobalComment | null;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-gold/60";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("rw-RW", {
    dateStyle: "medium",
    timeZone: "Africa/Kigali",
  }).format(date);
}

function CommentItem({ comment, slug, depth = 0 }: { comment: CommentView; slug: string; depth?: number }) {
  const router = useRouter();
  const [replying, setReplying] = useState(false);
  const replyRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(addCommentAction, emptyActionState);

  useEffect(() => {
    if (state.ok && state.message) {
      replyRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className={depth > 0 ? "ml-4 border-l border-white/10 pl-4 sm:ml-8" : ""}>
      <article
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
          {comment.status === "reported" && (
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[10px] font-bold text-amber-200 uppercase">
              Iracungwa
            </span>
          )}
        </div>

        {depth > 0 && (
          <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-gold/70 uppercase">
            <CornerDownRight className="size-3" /> Igisubizo
          </p>
        )}

        <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-white/70">
          {comment.message}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          <form action={toggleCommentLikeAction}>
            <input type="hidden" name="commentId" value={comment.id} />
            <input type="hidden" name="slug" value={slug} />
            <button
              type="submit"
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold transition-colors ${
                comment.likedByMe
                  ? "bg-rose-400/15 text-rose-300"
                  : "text-white/40 hover:text-rose-300"
              }`}
            >
              <Heart className={`size-3.5 ${comment.likedByMe ? "fill-rose-300" : ""}`} />
              {comment.likeCount > 0 ? comment.likeCount : "Nkunda"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setReplying((current) => !current)}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold text-white/40 transition-colors hover:text-gold"
          >
            <Reply className="size-3.5" />
            Subiza
          </button>
          <form action={reportCommentAction}>
            <input type="hidden" name="commentId" value={comment.id} />
            <input type="hidden" name="slug" value={slug} />
            <button
              type="submit"
              disabled={comment.reportedByMe}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold text-white/30 transition-colors hover:text-amber-200 disabled:text-amber-200/70"
            >
              <Flag className="size-3.5" />
              {comment.reportedByMe ? "Byatangajwe" : "Tangaza"}
            </button>
          </form>
        </div>

        {replying && (
          <form
            ref={replyRef}
            action={formAction}
            className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="parentId" value={comment.id} />
            <div className="hidden" aria-hidden="true">
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
              <input name="name" required maxLength={60} placeholder="Izina ryawe" className={inputClass} />
              <textarea
                name="message"
                required
                maxLength={1200}
                rows={2}
                placeholder="Andika igisubizo..."
                className={`${inputClass} resize-y`}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-extrabold text-ink hover:bg-amber-300 disabled:opacity-60"
              >
                <Send className="size-3.5" />
                {pending ? "Kubika..." : "Ohereza igisubizo"}
              </button>
              {state.message && (
                <p aria-live="polite" className={`text-xs ${state.ok ? "text-mint" : "text-rose-300"}`}>
                  {state.message}
                </p>
              )}
            </div>
          </form>
        )}
      </article>

      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} slug={slug} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
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
              <p aria-live="polite" className={`text-sm ${state.ok ? "text-mint" : "text-rose-300"}`}>
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
                <CommentItem key={comment.id} comment={comment} slug={slug} />
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
