import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import "./globals.css";
import AnalyticsTracker from "@/components/analytics-tracker";
import JsonLd from "@/components/json-ld";
import SiteChrome from "@/components/site-chrome";
import { getSettings } from "@/lib/data";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

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
  const siteUrl = getSiteUrl();
  const verificationToken =
    process.env.GOOGLE_SITE_VERIFICATION ||
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
    "_MlS2RSZ-8M1AWduF2i60nH13t4ansbhHS5Nll-Z0y8";
  const title = `${settings.siteName} — Agasobanuye mu Kinyarwanda`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.tagline,
    applicationName: settings.siteName,
    category: "entertainment",
    keywords: ["agasobanuye", "filime", "kinyarwanda", "ireberefilm", "cinema"],
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: settings.tagline,
      type: "website",
      locale: "rw_RW",
      siteName: settings.siteName,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: settings.tagline,
    },
    verification: verificationToken
      ? { other: { "google-site-verification": verificationToken } }
      : undefined,
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  const siteUrl = getSiteUrl();

  return (
    <html lang="rw" className={`${manrope.variable} ${outfit.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-ink text-white antialiased">
        <AnalyticsTracker />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: settings.siteName,
            alternateName: "ireberefilm",
            url: siteUrl,
            description: settings.tagline,
            inLanguage: "rw",
            potentialAction: {
              "@type": "SearchAction",
              target: absoluteUrl("/browse?q={search_term_string}"),
              "query-input": "required name=search_term_string",
            },
          }}
        />
        <SiteChrome
          searchPlaceholder={settings.searchPlaceholder}
          footerText={settings.footerText}
          contactEmail={settings.contactEmail}
          advertiseLabel={settings.advertiseLabel}
          advertiseWhatsappNumber={settings.advertiseWhatsappNumber}
          advertiseWhatsappMessage={settings.advertiseWhatsappMessage}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
