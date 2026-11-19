"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { ImagePlus, Save } from "lucide-react";
import { saveAdAction } from "@/lib/actions";
import { emptyActionState } from "@/lib/action-state";
import { adImageSrc } from "@/lib/ads";
import type { AdRecord } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-gold/60";

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="mb-2 block text-xs font-bold tracking-wider text-white/45 uppercase">
      {children}
      {hint && <span className="ml-2 normal-case tracking-normal text-white/25">{hint}</span>}
    </span>
  );
}

export default function AdForm({ ad }: { ad?: AdRecord }) {
  const [state, formAction, pending] = useActionState(saveAdAction, emptyActionState);
  const image = ad ? adImageSrc(ad) : "";
  const [preview, setPreview] = useState(image || null);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={ad?.id ?? ""} />

      {state.message ? (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            state.ok
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
              : "border-red-400/20 bg-red-400/10 text-red-200"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block">
          <Label>Izina ry&apos;uwamamaza</Label>
          <input
            name="advertiser"
            required
            maxLength={80}
            defaultValue={ad?.advertiser ?? ""}
            placeholder="Urugero: Igurisha Ryanjye"
            className={inputClass}
          />
        </label>
        <label className="block">
          <Label>Umutwe w&apos;iyamamajwe</Label>
          <input
            name="title"
            required
            maxLength={120}
            defaultValue={ad?.title ?? ""}
            placeholder="Urugero: Tegeka none"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block">
        <Label>Ubutumwa</Label>
        <textarea
          name="message"
          required
          maxLength={500}
          rows={4}
          defaultValue={ad?.message ?? ""}
          placeholder="Andika ubutumwa bugufi kandi busobanutse."
          className={inputClass}
        />
      </label>

      <div className="grid gap-5 lg:grid-cols-2">
        <label className="block">
          <Label>Isano (sidashobora kuba iriho)</Label>
          <input
            name="link"
            defaultValue={ad?.link ?? ""}
            placeholder="https://... cyangwa wa.me/2507..."
            className={inputClass}
          />
        </label>
        <label className="block">
          <Label>Ijambo rya buto</Label>
          <input
            name="ctaLabel"
            maxLength={60}
            defaultValue={ad?.ctaLabel ?? "Reba byinshi"}
            placeholder="Reba byinshi"
            className={inputClass}
          />
        </label>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <Label>Uko izajya iboneka</Label>
        <p className="text-sm leading-7 text-white/45">
          Iyamamajwe izagaragara nka square ntoya ku ruhande rw&apos;iburyo, kandi igaragaze popup kuri
          buri filime. Ntukayiha aho yashyizwe.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
        <div>
          <Label>Ifoto (ntibisabwa)</Label>
          <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-xs text-white/40 transition-colors hover:border-gold/50 hover:text-gold">
            <ImagePlus className="size-5" />
            Hitamo ifoto
            <input
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : image || null);
              }}
            />
          </label>
          {preview ? (
            <div className="relative mt-3 size-20 overflow-hidden rounded-xl border border-white/10">
              <Image src={preview} alt="" fill className="object-cover" sizes="80px" unoptimized />
            </div>
          ) : null}
          {ad?.imageId ? (
            <label className="mt-3 flex items-center gap-2 text-xs text-white/45">
              <input type="checkbox" name="removeImage" className="size-4 accent-[#f7b733]" />
              Siba ifoto
            </label>
          ) : null}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-7 text-white/45">
          <p>Ifoto ikoreshwa muri square ntoya; popup igaragara nk&apos;ubutumwa gusa.</p>
          <p>Nta isano? Iyamamajwe izagaragara gusa, ntihazaboneka buto yo kuyifungura.</p>
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm text-white/65">
        <input
          type="checkbox"
          name="active"
          defaultChecked={ad?.active ?? true}
          className="size-4 accent-[#f7b733]"
        />
        Iyamamajwe iri gukoreshwa (active)
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-extrabold text-ink transition-colors hover:bg-amber-300 disabled:opacity-50"
        >
          <Save className="size-4" />
          {pending ? "Bibikwa..." : "Bika iyamamajwe"}
        </button>
        <Link href="/admin/ads" className="rounded-xl px-4 py-3 text-sm font-bold text-white/40 hover:text-white">
          Subira inyuma
        </Link>
      </div>
    </form>
  );
}
