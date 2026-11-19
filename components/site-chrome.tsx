"use client";

import { usePathname } from "next/navigation";
import AdSlot from "@/components/ad-slot";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import type { AdRecord } from "@/lib/types";

type Props = {
  children: React.ReactNode;
  searchPlaceholder?: string;
  footerText?: string;
  contactEmail?: string;
  advertiseLabel?: string;
  advertiseWhatsappNumber?: string;
  advertiseWhatsappMessage?: string;
  ads?: AdRecord[];
};

export default function SiteChrome({
  children,
  searchPlaceholder,
  footerText,
  contactEmail,
  advertiseLabel,
  advertiseWhatsappNumber,
  advertiseWhatsappMessage,
  ads = [],
}: Props) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <SiteHeader
        searchPlaceholder={searchPlaceholder}
        advertiseLabel={advertiseLabel}
        advertiseWhatsappNumber={advertiseWhatsappNumber}
        advertiseWhatsappMessage={advertiseWhatsappMessage}
      />
      <div className="flex-1">{children}</div>
      <AdSlot ads={ads} />
      <SiteFooter
        footerText={footerText}
        contactEmail={contactEmail}
        advertiseLabel={advertiseLabel}
        advertiseWhatsappNumber={advertiseWhatsappNumber}
        advertiseWhatsappMessage={advertiseWhatsappMessage}
      />
    </>
  );
}
