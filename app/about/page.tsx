import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Compass, HeartHandshake, Play, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "@/components/reveal";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ibyacu",
  description: "ireberefilm — urubuga rwagatifu rw'Agasobanuye mu Kinyarwanda.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const values = [
  {
    icon: Compass,
    title: "Byose ahantu hamwe",
    text: "Filime, umusobanuzi n'icyiciro. Ntuzongera gushakisha hirya no hino.",
  },
  {
    icon: HeartHandshake,
    title: "Icyubahiro kuri bose",
      text: "Buri filime izana n'izina ry'umusobanuzi.",
  },
  {
    icon: ShieldCheck,
    title: "Bitagoranye",
    text: "Urubuga rworoshye, rwihuta, kandi rukorera neza kuri telefoni n'iyo ufite internet ntoya.",
  },
];

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <main className="relative min-h-screen overflow-hidden pt-[76px]">
      <div className="aurora aurora-fade pointer-events-none absolute inset-x-0 top-0 h-[720px]" />
      <div className="grid-lines pointer-events-none absolute inset-x-0 top-0 h-[720px]" />

      <section className="relative mx-auto max-w-4xl px-5 pt-20 pb-24 text-center sm:px-8 sm:pt-28">
        <Reveal>
          <span className="glass-soft mx-auto grid size-14 place-items-center rounded-2xl text-gold">
            <Sparkles className="size-6" />
          </span>
          <h1 className="font-display mt-8 text-5xl leading-[1.04] font-extrabold tracking-tight sm:text-7xl">
            Turi <span className="text-gradient">ireberefilm.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
            {settings.aboutIntro}
          </p>
        </Reveal>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.09}>
              <div className="glass-soft group h-full rounded-3xl p-7 transition-all duration-500 hover:-translate-y-2 hover:border-gold/30">
                <span className="grid size-12 place-items-center rounded-2xl bg-gold/10 text-gold transition-transform duration-500 group-hover:rotate-6">
                  <value.icon className="size-5" />
                </span>
                <h2 className="font-display mt-6 text-xl font-extrabold">{value.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/50">{value.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="ubufatanye" className="relative border-y border-white/[0.06] bg-ink-2/70 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="text-[11px] font-bold tracking-[0.24em] text-gold uppercase">Ubufatanye</p>
            <h2 className="font-display mt-5 text-4xl leading-tight font-extrabold sm:text-5xl">
              Ukoza Agasobanuye?
              <br />
              <span className="text-gradient-cool">Twese tubishaka.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/55">
              ireberefilm ntabwo ikora filime. Turazikusanya, tuzitondeka, tuzihesha
              icyubahiro kandi tuzigeza ku bantu bazikunda. Niba uri umusobanuzi cyangwa
              urubuga rukwirakwiza filime, tuvugane.
            </p>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-extrabold text-ink transition-all hover:gap-5"
            >
              Twandikire
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="glass relative overflow-hidden rounded-3xl p-7">
              <div className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-gold/20 orb" />
              <div className="relative">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase">Inyandiko y&apos;ubufatanye</p>
                <div className="mt-6 space-y-5 text-sm leading-7 text-white/65">
                  <p>
                    &ldquo;Muraho, ndi kuri ireberefilm, urubuga rukusanya Agasobanuye mu
                    Kinyarwanda. Nkunda cyane ibyo mukora kandi ndashaka ko abareba babona
                    filime zanyu batabanonye izina ryanyu.&rdquo;
                  </p>
                  <p>
                    &ldquo;Twifuza kuzishyira ku rubuga rwacu hamwe n&apos;izina ryanyu,
                    ikinyabupfura n&apos;isano iri ku filime yose. Niba mubyemera, tuzabishyira
                    muburyo mwifuza.&rdquo;
                  </p>
                </div>
                <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="grid size-9 place-items-center rounded-full bg-gold/15 text-gold">
                    <Play className="size-3 fill-gold" />
                  </span>
                  <span className="text-xs text-white/40">Icyubahiro · Ubufatanye · Ukuri</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="icyubahiro" className="relative mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-bold tracking-[0.24em] text-gold uppercase">Icyubahiro n&apos;uburenganzira</p>
          <h2 className="font-display mt-5 text-3xl font-extrabold sm:text-4xl">
            Abayikora baboneka.
          </h2>
          <p className="mt-6 text-base leading-8 text-white/55">
            Filime zose ziri kuri ireberefilm zifite izina ry&apos;umusobanuzi.
            Ntitudukora cyangwa ngo tuzigabanye uburenganzira
            bwazo. Niba uri nyir&apos;uburenganzira ukabona ko hari ikintu kitakwiriye kuba hano,
            tuzandikira kuri{" "}
            <a href="mailto:icyubahiro@ireberefilm.rw" className="font-bold text-gold hover:underline">
              icyubahiro@ireberefilm.rw
            </a>{" "}
            tukagikuraho vuba.
          </p>
          <Link href="/browse" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-gold hover:underline">
            Subira kuri filime
            <ArrowUpRight className="size-4" />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
