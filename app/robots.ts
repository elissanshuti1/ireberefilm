import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const allow: string[] = ["/", "/_next/static/", "/_next/image/", "/posters/", "/api/images/"];
const disallow: string[] = ["/admin", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: ["Googlebot", "Googlebot-Image"], allow, disallow },
      { userAgent: "*", allow, disallow },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
