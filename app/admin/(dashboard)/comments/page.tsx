import Link from "next/link";
import { Check, EyeOff, MessageSquare, Trash2 } from "lucide-react";
import { deleteCommentAction, moderateCommentAction } from "@/lib/actions";
import { getAllMovies, getReportedComments } from "@/lib/data";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("rw-RW", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Kigali",
  }).format(date);
}

export default async function AdminCommentsPage() {
  const [comments, movies] = await Promise.all([getReportedComments(), getAllMovies()]);
  const titles = new Map(movies.map((movie) => [movie.slug, movie.title]));

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Ubutumwa</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Kugenzura ubutumwa</h1>
        <p className="mt-2 text-sm text-white/45">
          Ubutumwa bwabwiwe kashyizwe hano kugira urebe ushyireho cyangwa ubihishe.
        </p>
      </div>

      {comments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-14 text-center">
          <MessageSquare className="mx-auto size-8 text-gold/40" />
          <p className="mt-4 text-sm text-white/45">Nta butumwa buri kugenzurwa.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                <span className="font-bold text-white">{comment.name}</span>
                <span>·</span>
                <span>{formatDate(comment.createdAt)}</span>
                <span>·</span>
                <span>{comment.reportedBy.length} raporo</span>
                <Link
                  href={`/movies/${comment.movieSlug}`}
                  className="text-gold hover:underline"
                >
                  {titles.get(comment.movieSlug) ?? comment.movieSlug}
                </Link>
              </div>
              <p className="mt-3 text-sm leading-7 whitespace-pre-wrap text-white/75">
                {comment.message}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <form action={moderateCommentAction}>
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input type="hidden" name="slug" value={comment.movieSlug} />
                  <input type="hidden" name="status" value="approved" />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-4 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-400/25"
                  >
                    <Check className="size-3.5" /> Emera
                  </button>
                </form>
                <form action={moderateCommentAction}>
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input type="hidden" name="slug" value={comment.movieSlug} />
                  <input type="hidden" name="status" value="hidden" />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/60 hover:text-white"
                  >
                    <EyeOff className="size-3.5" /> Hisha
                  </button>
                </form>
                <form action={deleteCommentAction}>
                  <input type="hidden" name="commentId" value={comment.id} />
                  <input type="hidden" name="slug" value={comment.movieSlug} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/20 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-400/10"
                  >
                    <Trash2 className="size-3.5" /> Siba
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
