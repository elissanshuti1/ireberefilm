import { NextRequest } from "next/server";
import { isAdPlacement } from "@/lib/ads";
import { recordAdEvent } from "@/lib/data";
import { getOrCreateVisitorId } from "@/lib/visitor";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const adId = String(body.adId ?? "");
  const placement = String(body.placement ?? "");
  const path = String(body.path ?? "/");
  if (!adId || !isAdPlacement(placement)) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const visitorId = await getOrCreateVisitorId();
  const ok = await recordAdEvent({ adId, type: "view", placement, visitorId, path });
  return Response.json({ ok });
}
