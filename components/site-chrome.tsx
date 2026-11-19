"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

type Props = {
  children: React.ReactNode;
  searchPlaceholder?: string;
  footerText?: string;
  contactEmail?: string;
  advertiseLabel?: string;
  advertiseWhatsappNumber?: string;
  advertiseWhatsappMessage?: string;
};

export default function SiteChrome({
  children,
  searchPlaceholder,
  footerText,
  contactEmail,
  advertiseLabel,
  advertiseWhatsappNumber,
  advertiseWhatsappMessage,
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
