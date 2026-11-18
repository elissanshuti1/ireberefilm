import WordsForm from "@/components/admin/words-form";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminWordsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.25em] text-gold uppercase">Amagambo</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">Hindura amagambo ya site</h1>
        <p className="mt-2 text-sm text-white/45">Ibyanditswe byose bigaragara kuri ireberefilm.rw biva hano.</p>
      </div>
      <WordsForm settings={settings} />
    </div>
  );
}
