"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { requireAdmin, verifyAdminPassword, adminCookieName, createSessionToken } from "@/lib/auth";
import {
  getCommentsCollection,
  getGenresCollection,
  getMoviesCollection,
  getSettingsCollection,
  getPostersBucket,
} from "@/lib/db";
import { deletePoster, uploadPoster } from "@/lib/images";
import { normalizeSlug } from "@/lib/slug";
import { getOrCreateVisitorId } from "@/lib/visitor";
import { isValidWhatsAppNumber } from "@/lib/whatsapp";
import type { ActionState } from "@/lib/action-state";
import type { EpisodeRecord } from "@/lib/types";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function optionalNumber(formData: FormData, name: string) {
  const raw = field(formData, name);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.trunc(value) : null;
}

function safeUrl(value: string, label: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const candidate = trimmed.startsWith("//")
    ? `https:${trimmed}`
    : /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    return url.toString();
  } catch {
    throw new Error(`${label} igomba kuba link ya http cyangwa https`);
  }
}

function isVsembedUrl(value: string) {
  try {
    const host = new URL(value).hostname.toLowerCase().replace(/^www\./, "");
    return host === "vsembed.com" || host.endsWith(".vsembed.com");
  } catch {
    return false;
  }
}

function safeEmbedUrl(value: string) {
  return safeUrl(value, "Embed link") || null;
}

function episodesFromForm(formData: FormData): EpisodeRecord[] {
  const ids = field(formData, "episodeIds")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return ids
    .map((id, index) => {
      const number = Number(field(formData, `episode-${id}-number`)) || index + 1;
      const title = field(formData, `episode-${id}-title`) || `Igice cya ${number}`;
      const rawLink =
        field(formData, `episode-${id}-url`) ||
        field(formData, `episode-${id}-sourceUrl`) ||
        field(formData, `episode-${id}-embedUrl`);
      const sourceUrl = safeUrl(rawLink, `Link ya ${title}`);
      if (!sourceUrl) {
        throw new Error(`Shyira link ya ${title}`);
      }
      const playback: EpisodeRecord["playback"] = isVsembedUrl(sourceUrl)
        ? "embed"
        : "link";
      const embedUrl = playback === "embed" ? sourceUrl : null;
      return { id, number, title, playback, embedUrl, sourceUrl };
    })
    .sort((a, b) => a.number - b.number);
}

function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/browse");
  revalidatePath("/about");
  if (slug) revalidatePath(`/movies/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/movies");
  revalidatePath("/admin/genres");
  revalidatePath("/admin/words");
}

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const username = field(formData, "username");
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(username, password)) {
    return { ok: false, message: "Izina cyangwa ijambo ry'ibanga si ryo" };
  }
  const store = await cookies();
  store.set(adminCookieName, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(adminCookieName);
  redirect("/admin/login");
}

export async function saveMovieAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  try {
    const id = field(formData, "id");
    const title = field(formData, "title");
    if (!title) throw new Error("Andika izina rya filime");

    const originalTitle = field(formData, "originalTitle");
    const synopsis = field(formData, "synopsis");
    const genre = field(formData, "genre") || "Drama";
    const year = Number(field(formData, "year")) || new Date().getFullYear();
    const duration = field(formData, "duration") || "—";
    const rating = field(formData, "rating") || "0";
    const creator = field(formData, "creator");
    const kind =
      field(formData, "kind") || (formData.has("isSeason") ? "season" : "movie");
    const isSeason = kind === "season";
    const hasParts = kind === "parts";
    const isMultiPart = isSeason || hasParts;
    const source = isMultiPart ? "" : field(formData, "source");
    const sourceUrl = isMultiPart ? "" : safeUrl(field(formData, "sourceUrl"), "Source link");
    const playback =
      isMultiPart || field(formData, "playback") !== "embed" ? "link" : "embed";
    const embedUrl =
      isMultiPart || playback !== "embed"
        ? null
        : safeEmbedUrl(field(formData, "embedUrl") || sourceUrl);
    if (!isMultiPart && playback === "embed" && !embedUrl) {
      throw new Error("Shyira embed link");
    }
    const episodes = isMultiPart ? episodesFromForm(formData) : [];

    let slug = normalizeSlug(field(formData, "slug") || title);
    if (!slug) throw new Error("Slug ntiboneka");

    const collection = await getMoviesCollection();
    const existing = id && ObjectId.isValid(id) ? await collection.findOne({ _id: new ObjectId(id) }) : null;
    const slugOwner = await collection.findOne({ slug });
    if (slugOwner && (!existing || String(slugOwner._id) !== String(existing._id))) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
    }

    const poster = formData.get("poster");
    let posterId = existing ? String((existing as Record<string, unknown>).posterId ?? "") || null : null;
    let posterUrl = existing ? String((existing as Record<string, unknown>).posterUrl ?? "") || null : null;
    if (poster instanceof File && poster.size > 0) {
      if (posterId) await deletePoster(posterId);
      posterId = await uploadPoster(poster);
      posterUrl = null;
    }

    const now = new Date().toISOString();
    const document = {
      slug,
      title,
      originalTitle,
      synopsis,
      posterId,
      posterUrl,
      genre,
      year,
      duration,
      rating,
      creator,
      source,
      sourceUrl,
      playback,
      embedUrl,
      isSeason,
      hasParts,
      episodes,
      featured: formData.has("featured"),
      published: formData.has("published"),
      linkStatus: "unknown",
      lastCheckedAt: null,
      brokenReports: 0,
      homeOrder: optionalNumber(formData, "homeOrder"),
      updatedAt: now,
    };

    if (existing) {
      await collection.updateOne({ _id: existing._id }, { $set: document });
    } else {
      await collection.insertOne({ ...document, createdAt: now });
    }

    revalidatePublic(slug);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Habaye ikosa" };
  }
  redirect("/admin/movies?saved=1");
}

export async function deleteMovieAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  if (!ObjectId.isValid(id)) return;
  const collection = await getMoviesCollection();
  const movie = await collection.findOne({ _id: new ObjectId(id) });
  if (!movie) return;
  if (movie.posterId) await deletePoster(String(movie.posterId));
  await collection.deleteOne({ _id: new ObjectId(id) });
  revalidatePublic(String(movie.slug));
}

export async function toggleMovieAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  const key = field(formData, "key");
  if (!ObjectId.isValid(id) || !["published", "featured"].includes(key)) return;
  const collection = await getMoviesCollection();
  const movie = await collection.findOne({ _id: new ObjectId(id) });
  if (!movie) return;
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { [key]: !movie[key], updatedAt: new Date().toISOString() } },
  );
  revalidatePublic(String(movie.slug));
}

export async function moveMovieToFrontAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  if (!ObjectId.isValid(id)) return;
  const collection = await getMoviesCollection();
  const movie = await collection.findOne({ _id: new ObjectId(id) });
  if (!movie) return;

  const docs = await collection.find({}, { projection: { homeOrder: 1 } }).toArray();
  const orders = docs
    .map((doc) => doc.homeOrder)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  const nextOrder = orders.length ? Math.min(...orders) - 1 : 0;

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { homeOrder: nextOrder, updatedAt: new Date().toISOString() } },
  );
  revalidatePublic(String(movie.slug));
  revalidatePath("/admin/movies");
}

export async function checkLinkAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  if (!ObjectId.isValid(id)) return;
  const collection = await getMoviesCollection();
  const movie = await collection.findOne({ _id: new ObjectId(id) });
  if (!movie) return;
  const episodes = Array.isArray(movie.episodes) ? movie.episodes : [];
  const firstEpisode = episodes[0] as Record<string, unknown> | undefined;
  const target = movie.isSeason || movie.hasParts
    ? firstEpisode?.playback === "embed"
      ? firstEpisode?.embedUrl
      : firstEpisode?.sourceUrl
    : movie.playback === "embed"
      ? movie.embedUrl
      : movie.sourceUrl;
  let status: "ok" | "broken" = "broken";
  if (target) {
    try {
      const response = await fetch(String(target), {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(7000),
      });
      status = response.ok ? "ok" : "broken";
    } catch {
      status = "broken";
    }
  }
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { linkStatus: status, lastCheckedAt: new Date().toISOString() } },
  );
  revalidatePublic(String(movie.slug));
}

export async function reportBrokenAction(formData: FormData) {
  const slug = field(formData, "slug");
  const collection = await getMoviesCollection();
  await collection.updateOne(
    { slug },
    {
      $inc: { brokenReports: 1 },
      $set: { linkStatus: "broken", updatedAt: new Date().toISOString() },
    },
  );
  revalidatePath(`/movies/${slug}`);
}

export async function saveGenreAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = field(formData, "id");
  const name = field(formData, "name");
  if (!name) return { ok: false, message: "Andika izina ry'icyiciro" };
  const color = field(formData, "color") || "#f7b733";
  const order = Number(field(formData, "order")) || 0;
  const collection = await getGenresCollection();
  const document = { name, slug: normalizeSlug(name), color, order };
  if (id && ObjectId.isValid(id)) {
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: document });
  } else {
    const duplicate = await collection.findOne({ name });
    if (duplicate) return { ok: false, message: "Icyiciro kiriho already" };
    await collection.insertOne(document);
  }
  revalidatePublic();
  redirect("/admin/genres?saved=1");
}

export async function deleteGenreAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  if (!ObjectId.isValid(id)) return;
  const collection = await getGenresCollection();
  await collection.deleteOne({ _id: new ObjectId(id) });
  revalidatePublic();
}

export async function saveSettingsAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const keys = [
    "siteName",
    "tagline",
    "heroCta",
    "heroSecondary",
    "newTitle",
    "popularTitle",
    "categoriesTitle",
    "searchPlaceholder",
    "aboutIntro",
    "footerText",
    "contactEmail",
    "advertiseLabel",
    "advertiseWhatsappNumber",
    "advertiseWhatsappMessage",
  ];
  const advertiseWhatsappNumber = field(formData, "advertiseWhatsappNumber").trim();
  if (advertiseWhatsappNumber && !isValidWhatsAppNumber(advertiseWhatsappNumber)) {
    return { ok: false, message: "Andika nimero ya WhatsApp mu buryo bw'ukuri" };
  }
  const document: Record<string, string> = { key: "site" };
  for (const key of keys) document[key] = field(formData, key);
  document.advertiseLabel = field(formData, "advertiseLabel").trim() || "Ushaka kwamamaza";
  document.advertiseWhatsappMessage =
    field(formData, "advertiseWhatsappMessage").trim() ||
    "Muraho, nshaka kwamamaza kuri ireberefilm. Nshobora kuvugana namwe hano.";
  const collection = await getSettingsCollection();
  await collection.updateOne({ key: "site" }, { $set: document }, { upsert: true });
  revalidatePublic();
  return { ok: true, message: "Amagambo yabikiwe" };
}

export async function uploadPosterOnlyAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("poster");
  if (!(file instanceof File)) return null;
  return uploadPoster(file);
}

export async function cleanupOrphanPosterAction(id: string) {
  await requireAdmin();
  const bucket = await getPostersBucket();
  const collection = await getMoviesCollection();
  const used = await collection.findOne({ posterId: id });
  if (!used && ObjectId.isValid(id)) await bucket.delete(new ObjectId(id));
}

function cleanCommentInput(formData: FormData) {
  const name = field(formData, "name").replace(/\s+/g, " ").slice(0, 60);
  const message = field(formData, "message").trim().slice(0, 1200);
  if (name.length < 2) throw new Error("Andika izina ryawe");
  if (message.length < 2) throw new Error("Andika ubutumwa bwawe");
  return { name, message };
}

function revalidateMovie(slug: string, movieId?: string) {
  revalidatePath(`/movies/${slug}`);
  revalidatePath("/admin/movies");
  if (movieId) revalidatePath(`/admin/movies/${movieId}`);
}

export async function addCommentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const slug = normalizeSlug(field(formData, "slug"));
    if (!slug) throw new Error("Filime ntiboneka");
    if (field(formData, "website")) return { ok: true, message: "Ubutumwa bwabikiwe" };

    const { name, message } = cleanCommentInput(formData);
    const movies = await getMoviesCollection();
    const movie = await movies.findOne({ slug, published: { $ne: false } });
    if (!movie) throw new Error("Filime ntiboneka");

    const parentId = field(formData, "parentId");
    const comments = await getCommentsCollection();
    if (parentId) {
      if (!ObjectId.isValid(parentId)) throw new Error("Ubutumwa ntiboneka");
      const parent = await comments.findOne({
        _id: new ObjectId(parentId),
        movieSlug: slug,
        status: { $ne: "hidden" },
      });
      if (!parent) throw new Error("Ubutumwa ntiboneka");
    }

    const visitorId = await getOrCreateVisitorId();
    await comments.insertOne({
      movieSlug: slug,
      name,
      message,
      pinned: false,
      authorRole: "viewer",
      visitorId,
      parentId: parentId || null,
      likedBy: [],
      reportedBy: [],
      status: "approved",
      createdAt: new Date().toISOString(),
    });
    revalidateMovie(slug);
    return { ok: true, message: "Ubutumwa bwabikiwe. Urakoze!" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Habaye ikosa" };
  }
}

export async function adminAddCommentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  try {
    const slug = normalizeSlug(field(formData, "slug"));
    const movieId = field(formData, "movieId");
    if (!slug) throw new Error("Filime ntiboneka");

    const { name, message } = cleanCommentInput(formData);
    const comments = await getCommentsCollection();
    await comments.insertOne({
      movieSlug: slug,
      name,
      message,
      pinned: formData.has("pinned"),
      authorRole: "admin",
      visitorId: "admin",
      parentId: null,
      likedBy: [],
      reportedBy: [],
      status: "approved",
      createdAt: new Date().toISOString(),
    });
    revalidateMovie(slug, movieId);
    return { ok: true, message: "Ubutumwa bwabikiwe" };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Habaye ikosa" };
  }
}

export async function pinCommentAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "commentId");
  const slug = normalizeSlug(field(formData, "slug"));
  const movieId = field(formData, "movieId");
  if (!ObjectId.isValid(id) || !slug) return;

  const comments = await getCommentsCollection();
  await comments.updateOne(
    { _id: new ObjectId(id), movieSlug: slug },
    { $set: { pinned: field(formData, "pinned") === "1" } },
  );
  revalidateMovie(slug, movieId);
}

export async function toggleCommentLikeAction(formData: FormData) {
  const id = field(formData, "commentId");
  const slug = normalizeSlug(field(formData, "slug"));
  if (!ObjectId.isValid(id) || !slug) return;

  const visitorId = await getOrCreateVisitorId();
  const comments = await getCommentsCollection();
  const comment = await comments.findOne({ _id: new ObjectId(id), movieSlug: slug });
  if (!comment || comment.status === "hidden") return;

  const likedBy = Array.isArray(comment.likedBy) ? comment.likedBy.map(String) : [];
  const nextLikedBy = likedBy.includes(visitorId)
    ? likedBy.filter((item) => item !== visitorId)
    : [...likedBy, visitorId];
  await comments.updateOne(
    { _id: new ObjectId(id) },
    { $set: { likedBy: nextLikedBy, updatedAt: new Date().toISOString() } },
  );
  revalidateMovie(slug);
}

export async function reportCommentAction(formData: FormData) {
  const id = field(formData, "commentId");
  const slug = normalizeSlug(field(formData, "slug"));
  if (!ObjectId.isValid(id) || !slug) return;

  const visitorId = await getOrCreateVisitorId();
  const comments = await getCommentsCollection();
  const comment = await comments.findOne({ _id: new ObjectId(id), movieSlug: slug });
  if (!comment || comment.status !== "approved") return;

  const reportedBy = Array.isArray(comment.reportedBy) ? comment.reportedBy.map(String) : [];
  if (reportedBy.includes(visitorId)) return;
  await comments.updateOne(
    { _id: new ObjectId(id) },
    {
      $addToSet: { reportedBy: visitorId },
      $set: {
        updatedAt: new Date().toISOString(),
        ...(reportedBy.length + 1 >= 2 ? { status: "reported" } : {}),
      },
    },
  );
  revalidateMovie(slug);
}

export async function moderateCommentAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "commentId");
  const slug = normalizeSlug(field(formData, "slug"));
  const status = field(formData, "status");
  if (!ObjectId.isValid(id) || !slug || !["approved", "hidden"].includes(status)) return;

  const comments = await getCommentsCollection();
  await comments.updateOne(
    { _id: new ObjectId(id), movieSlug: slug },
    { $set: { status, reportedBy: [], updatedAt: new Date().toISOString() } },
  );
  revalidateMovie(slug);
}

export async function deleteCommentAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "commentId");
  const slug = normalizeSlug(field(formData, "slug"));
  const movieId = field(formData, "movieId");
  if (!ObjectId.isValid(id) || !slug) return;

  const comments = await getCommentsCollection();
  await comments.deleteMany({
    movieSlug: slug,
    $or: [{ _id: new ObjectId(id) }, { parentId: id }],
  });
  revalidateMovie(slug, movieId);
}

export async function savePinnedCommentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  try {
    const name = field(formData, "name").replace(/\s+/g, " ").slice(0, 60) || "Ireberefilm";
    const message = field(formData, "message").trim().slice(0, 1200);
    const settings = await getSettingsCollection();
    await settings.updateOne(
      { key: "pinnedComment" },
      {
        $set: {
          key: "pinnedComment",
          name,
          message,
          updatedAt: new Date().toISOString(),
        },
      },
      { upsert: true },
    );

    const moviesCollection = await getMoviesCollection();
    const movies = await moviesCollection
      .find({ published: { $ne: false } }, { projection: { slug: 1 } })
      .toArray();
    for (const movie of movies) {
      const slug = String(movie.slug ?? "");
      if (slug) revalidatePath(`/movies/${slug}`);
    }
    revalidatePublic();
    return {
      ok: true,
      message: message ? "Ubutumwa bwashyizwe kuri filime zose" : "Ubutumwa bwavanywe",
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Habaye ikosa" };
  }
}
