import Link from "next/link";
import { MessageSquare, Pin } from "lucide-react";
import PinnedCommentForm from "@/components/admin/pinned-comment-form";
import { getAllComments, getAllMovies, getGlobalPinnedComment } from "@/lib/data";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("rw-RW", {
    dateStyle: "medium",
    timeZone: "Africa/Kigali",
  }).format(new Date(value));
}

export default async function PinCommentPage() {
  const [comments, movies, globalComment] = await Promise.all([
    getAllComments(),
    getAllMovies(),
    getGlobalPinnedComment(),
  ]);
  const moviesBySlug = new Map(movies.map((movie) => [movie.slug, movie]));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Ubutumwa</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Pin comment</h1>
        <p className="mt-2 text-sm text-white/45">
          Ubutumwa hano bushobora kuba hejuru kuri buri filime. Ubona n&apos;abantu bose banditse
          kuri filime zawe.
        </p>
      </div>

      <section className="rounded-2xl border border-gold/25 bg-gold/[0.04] p-6">
        <div className="flex items-center gap-3">
          <Pin className="size-5 text-gold" />
          <h2 className="font-display text-lg font-extrabold">Ubutumwa kuri filime zose</h2>
        </div>
        <p className="mt-2 text-sm text-white/45">
          Ubu: {globalComment ? globalComment.message : "nta butumwa buri hejuru kuri filime zose."}
        </p>
        <div className="mt-5">
          <PinnedCommentForm initial={globalComment} />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="size-5 text-gold" />
          <h2 className="font-display text-lg font-extrabold">
            Abantu banditse ({comments.length})
          </h2>
        </div>

        {comments.length === 0 ? (
          <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-white/40">
            Nta muntu uratanga ubutumwa kuri filime ubu.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {comments.map((comment) => {
              const movie = moviesBySlug.get(comment.movieSlug);
              return (
                <article
                  key={comment.id}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-sm font-extrabold text-white">{comment.name}</p>
                    {comment.authorRole === "admin" && (
                      <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[10px] font-bold text-gold uppercase">
                        Umuyobozi
                      </span>
                    )}
                    {comment.pinned && (
                      <span className="rounded-full border border-mint/25 bg-mint/10 px-2.5 py-1 text-[10px] font-bold text-mint uppercase">
                        Hejuru kuri iyi filime
                      </span>
                    )}
                    <span className="text-xs text-white/30">·</span>
                    <time className="text-xs text-white/35" dateTime={comment.createdAt}>
                      {formatDate(comment.createdAt)}
                    </time>
                  </div>
                  <p className="mt-2 text-sm leading-6 whitespace-pre-wrap text-white/70">
                    {comment.message}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold">
                    <Link
                      href={`/movies/${encodeURIComponent(comment.movieSlug)}`}
                      className="text-white/40 hover:text-gold"
                    >
                      {movie?.title ?? comment.movieSlug}
                    </Link>
                    {movie && (
                      <Link
                        href={`/admin/movies/${movie.id}`}
                        className="text-gold hover:underline"
                      >
                        Hindura ubutumwa
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
