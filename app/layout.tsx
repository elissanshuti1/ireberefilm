import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/site-chrome";
import { getSettings } from "@/lib/data";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: `${settings.siteName} — Agasobanuye mu Kinyarwanda`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.tagline,
    keywords: ["agasobanuye", "filime", "kinyarwanda", "ireberefilm", "oshakurfilms"],
    openGraph: {
      title: `${settings.siteName} — Agasobanuye mu Kinyarwanda`,
      description: settings.tagline,
      type: "website",
      locale: "rw_RW",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    <html lang="rw" className={`${manrope.variable} ${outfit.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-ink text-white antialiased">
        <SiteChrome
          searchPlaceholder={settings.searchPlaceholder}
          footerText={settings.footerText}
          contactEmail={settings.contactEmail}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
