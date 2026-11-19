import { notFound } from "next/navigation";
import AdForm from "@/components/admin/ad-form";
import { getAdById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdById(id);
  if (!ad) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Hindura</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">{ad.title}</h1>
        <p className="mt-2 text-sm text-white/45">Hindura ubutumwa, isano cyangwa uko igaragara.</p>
      </div>
      <AdForm ad={ad} />
    </div>
  );
}
