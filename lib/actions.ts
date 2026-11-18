"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { requireAdmin, verifyAdminPassword, adminCookieName, createSessionToken } from "@/lib/auth";
import {
  getGenresCollection,
  getMoviesCollection,
  getSettingsCollection,
  getPostersBucket,
} from "@/lib/db";
import { deletePoster, uploadPoster } from "@/lib/images";
import type { ActionState } from "@/lib/action-state";

function field(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeUrl(value: string, label: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    return url.toString();
  } catch {
    throw new Error(`${label} igomba kuba link ya http cyangwa https`);
  }
}

const embedHosts = ["vsembed.com", "oshakurfilms.com", "youtube.com", "youtu.be", "dailymotion.com"];

function safeEmbedUrl(value: string) {
  const url = safeUrl(value, "Embed link");
  if (!url) return null;
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (!embedHosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))) {
    throw new Error("Embed link igomba kuba ya vsembed, youtube cyangwa oshakurfilms");
  }
  return url;
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
    const source = field(formData, "source");
    const sourceUrl = safeUrl(field(formData, "sourceUrl"), "Source link");
    const playback = field(formData, "playback") === "embed" ? "embed" : "link";
    const embedUrl = playback === "embed" ? safeEmbedUrl(field(formData, "embedUrl")) : null;
    if (playback === "embed" && !embedUrl) throw new Error("Shyira embed link ya vsembed");

    let slug = field(formData, "slug") || slugify(title);
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
      featured: formData.has("featured"),
      published: formData.has("published"),
      linkStatus: "unknown",
      lastCheckedAt: null,
      brokenReports: 0,
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

export async function checkLinkAction(formData: FormData) {
  await requireAdmin();
  const id = field(formData, "id");
  if (!ObjectId.isValid(id)) return;
  const collection = await getMoviesCollection();
  const movie = await collection.findOne({ _id: new ObjectId(id) });
  if (!movie) return;
  const target = movie.playback === "embed" ? movie.embedUrl : movie.sourceUrl;
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
  const document = { name, slug: slugify(name), color, order };
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
  ];
  const document: Record<string, string> = { key: "site" };
  for (const key of keys) document[key] = field(formData, key);
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
