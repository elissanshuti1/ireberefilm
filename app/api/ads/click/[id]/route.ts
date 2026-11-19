import { NextRequest, NextResponse } from "next/server";
import { isAdPlacement } from "@/lib/ads";
import { getAdById, recordAdEvent } from "@/lib/data";
import { getOrCreateVisitorId } from "@/lib/visitor";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;
  const ad = await getAdById(id);
  const placementValue = request.nextUrl.searchParams.get("placement") ?? "";
  const placement = isAdPlacement(placementValue) ? placementValue : ad?.placements[0] ?? "home_after_hero";

  if (!ad || !ad.link) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const visitorId = await getOrCreateVisitorId();
  await recordAdEvent({
    adId: id,
    type: "click",
    placement,
    visitorId,
    path: request.headers.get("referer") ?? "/",
  });
  return NextResponse.redirect(ad.link);
}
