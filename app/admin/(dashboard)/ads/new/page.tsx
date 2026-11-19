import AdForm from "@/components/admin/ad-form";

export const dynamic = "force-dynamic";

export default function NewAdPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Yamamajwe nshya</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Ongera iyamamajwe</h1>
        <p className="mt-2 text-sm text-white/45">
          Hitamo aho izajya iboneka, isano n&apos;igihe cyo kugaragara.
        </p>
      </div>
      <AdForm />
    </div>
  );
}
