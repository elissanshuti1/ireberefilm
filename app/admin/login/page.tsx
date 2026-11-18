import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "@/components/admin/login-form";

export const metadata = { title: "Kwinjira | ireberefilm Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-6 py-16">
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-gold/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 size-[420px] rounded-full bg-sky-500/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 font-display text-2xl font-black">
          irebere<span className="text-gold">film</span>
        </Link>
        <p className="mt-2 text-center text-sm text-white/40">Admin panel — koresha ibyangombwa byawe</p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="font-display text-2xl font-extrabold">Kwinjira muri Admin</h1>
          <p className="mt-2 text-sm text-white/45">
            Hano ushobora kuyobora filime, amagambo n&apos;ibyiciro byose.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
